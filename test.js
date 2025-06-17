const db = require('./Models/index');
const bcrypt = require('bcrypt');

async function testDatabase() {
    try {
        // Create an admin
        const admin = await db.Admin.create({
            username: 'admin1',
            email: 'admin@example.com',
            password_hash: await bcrypt.hash('adminpassword', 10),
            full_name: 'Admin One',
            gender: 'Pria',
            nip: '1234567890',
            phone_number: '1234567890',
            positions: 'Manager',
            address: '123 Admin St'
        });
        console.log('Admin created:', admin.toJSON());

        // Create a user
        const user = await db.User.create({
            username: 'johndoe',
            email: 'john@example.com',
            password_hash: await bcrypt.hash('userpassword', 10),
            is_verified: true,
            nik: '12345678890432',
            full_name: 'John 423',
            gender: "Pria",
            address: "KHA Dahlah",
            id_card_photo: 'APAPUN ini',
            verified_by_admin_id: admin.admin_id,
            verified_at: new Date()
        });
        console.log('User created:', user.toJSON());

        // Create a user profile
        const profile = await db.UserProfile.create({
            user_id: user.user_id,
            birth_date: '1990-01-01',
            phone_number: '9876543210',
            profile_photo: 'photo.jpg',
            last_login: new Date()
        });
        console.log('UserProfile created:', profile.toJSON());

        // Query with associations
        const userWithProfile = await db.User.findOne({
            where: { username: 'johndoe' },
            include: [
                { model: db.UserProfile, as: 'profile' },
                { model: db.Admin, as: 'verifier' }
            ]
        });
        console.log('User with profile and verifier:', JSON.stringify(userWithProfile, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testDatabase();