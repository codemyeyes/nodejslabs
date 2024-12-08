const { MongoClient } = require('mongodb');
const fs = require('fs');

// กำหนด URL ของ MongoDB และชื่อ Database
const url = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

(async function exportSchema() {
    const client = new MongoClient(url);

    try {
        // เชื่อมต่อกับ MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);

        // ดึงรายชื่อ Collection ทั้งหมด
        const collections = await db.listCollections().toArray();

        const schemaExport = {};

        for (const collection of collections) {
            const collectionName = collection.name;

            // ดึงข้อมูล Schema ของ Collection
            const schema = await db.collection(collectionName).findOne();
            const indexes = await db.collection(collectionName).indexes();

            // บันทึก Schema และ Index ลงใน Object
            schemaExport[collectionName] = {
                schema: schema ? Object.keys(schema) : [],
                indexes: indexes,
            };
        }

        // Export ข้อมูลเป็นไฟล์ JSON
        fs.writeFileSync(
            './schemaExport.json',
            JSON.stringify(schemaExport, null, 2),
            'utf-8'
        );
        console.log('Schema and indexes exported successfully!');
    } catch (err) {
        console.error('Error exporting schema:', err);
    } finally {
        await client.close();
    }
})();
