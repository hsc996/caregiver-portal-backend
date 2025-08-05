const swaggerJsdocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevDash Backend API',
            version: '1.0.0',
            description: 'Node/Express API with Swagger documentation',
        },
    },
    apis: [__dirname + '/../routes/*.js'],
};

const swaggerSpecs = swaggerJsdocs(swaggerOptions);

module.exports = {
    swaggerSpecs,
    swaggerUi
}