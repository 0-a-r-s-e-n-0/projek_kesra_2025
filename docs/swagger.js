const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Konfigurasi Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KESRA API Documentation',
            version: '1.0.0',
            description: 'Dokumentasi untuk seluruh endpoint KESRA',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Base Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: [
        // path.join(__dirname, './Routes/*.js'),      // anotasi JSDoc inline
        path.join(__dirname, './**/*.yaml'),   // file YAML modular
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
