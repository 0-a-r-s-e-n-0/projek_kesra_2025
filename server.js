const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./Models');
const userRoutes = require('./Routes/userRoutes');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const HOST = 'localhost' || '192.168.100.122';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

db.sequelize.authenticate()
    .then(() => {
        console.log('Database connected to kesra_gubsu');
        return db.sequelize.sync({ force: false });
    })
    .then(() => {
        console.log('Database synchronized');
        app.listen(PORT, HOST, () => console.log(`Server is running at http://${HOST}:${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    });
