const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./Routes/userRoutes');
const mailRoutes = require('./Routes/mailRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const addressRoutes = require('./Routes/addressRoutes');
const proposalRoutes = require('./Routes/proposalRoutes');
const { swaggerUi, swaggerSpec } = require('./docs/swagger');

const app = express();

// Middleware dasar
app.use(morgan('dev')); // format 'dev' bagus saat development
app.use(cors({
    origin: [
        'http://localhost:8080',
        //'https://domainmu.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Limit 100 requests per 15 menit per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Too many requests, please try again later',
        errorCode: 'RATE_LIMITED'
    }
});
app.use(limiter);

// Static & Swagger
app.use('/api', express.static('docs'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/proposal', proposalRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'API endpoint not found',
        errorCode: 'NOT_FOUND'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Express error handler:', err);
    res.status(err.status || 500).json({
        status: 'error',
        statusCode: err.status || 500,
        message: err.message || 'Internal Server Error',
        errorCode: err.code || 'INTERNAL_ERROR'
    });
});

module.exports = app;
