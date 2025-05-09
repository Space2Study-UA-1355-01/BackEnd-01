const swaggerJsDoc = require('swagger-jsdoc')

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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./docs/*.yaml']
}

module.exports = swaggerJsDoc(swaggerOptions)
