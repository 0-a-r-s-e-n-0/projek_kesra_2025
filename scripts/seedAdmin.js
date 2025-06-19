const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../Models');

async function run() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await db.Admin.create({
            username: 'admin122',
            email: 'admin122@example.com',
            password_hash: hashedPassword,
            full_name: 'Admin Utama',
            gender: 'Pria',
            phone_number: '081234567890',
            nip: '12345678901124444345',
            positions: 'Super Admin',
            address: 'Jl. Kebon Jeruk No.1, Jakarta'
        }); console.log('✅ Admin created via model!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await db.sequelize.close();
    }
}
run();
