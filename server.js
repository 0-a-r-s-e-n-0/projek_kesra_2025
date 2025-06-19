require('dotenv').config();
const db = require('./Models');
const app = require('./app');

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise);
    console.error('👉 Reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception thrown:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 8080;
const HOST = 'localhost'; // Ubah manual kalau mau pakai IP lokal

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected to kesra_gubsu');
        return db.sequelize.sync({ force: false });
    })
    .then(() => {
        console.log('✅ Database synchronized');
        app.listen(PORT, HOST, () => {
            console.log(`Server is running at http://${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to the database:', err);
        process.exit(1);
    });
