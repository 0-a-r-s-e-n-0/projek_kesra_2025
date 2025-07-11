const bcrypt = require('bcrypt');
const db = require('../Models');

async function run() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await db.SuperAdmin.create({
            username: 'admin122',
            email: 'admin122@example.com',
            password_hash: hashedPassword,
            full_name: 'Admin Utama',
            phone_number: '081234567890',
        }); console.log('✅ Super Admin created via model!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await db.sequelize.close();
    }
}
run();
