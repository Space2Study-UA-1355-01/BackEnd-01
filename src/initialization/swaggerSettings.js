const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for space2study',
      version: '1',
      description: ''
    },
    servers: [
      {
        url: process.env.SERVER_URL
      }
    ],
    components: {
      securitySchemes: {}
    }
  },
  apis: ['./docs/*.yaml']
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsDoc(swaggerOptions);
} catch (error) {
  console.error('Error with creating Swagger documentation:', error);
  swaggerSpec = {}; 
}

module.exports = swaggerSpec;
