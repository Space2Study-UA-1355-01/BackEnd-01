const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for space2study',
      version: '',
      description: ''
    },
    servers: [
      {
        url: process.env.SERVER_URL
      }
    ],
    components: {
      securitySchemes: {
        //cookieAuth or any other security schema
      }
    }
  },
  apis: ['./path to your API documentation file']
}

const swaggerSettings = swaggerJsDoc(swaggerOptions)

const {
  config: { CLIENT_URL }
} = require('~/configs/config')
const router = require('~/routes')
const { createNotFoundError } = require('~/utils/errorsHelper')
const errorMiddleware = require('~/middlewares/error')

const initialization = (app) => {
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'development' ? true : CLIENT_URL,
      credentials: true,
      methods: 'GET, POST, PATCH, DELETE',
      allowedHeaders: 'Content-Type, Authorization'
    })
  )

  app.use('/', router)

  app.use((_req, _res, next) => {
    next(createNotFoundError())
  })

  app.use(errorMiddleware)

  app.use('/route for your swagger docs', swaggerUI.serve, swaggerUI.setup(swaggerSettings))
}

module.exports = initialization
