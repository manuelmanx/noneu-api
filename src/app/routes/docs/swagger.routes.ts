import express from 'express'
import loadEnv from '../../services/env';
import * as swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const route = express.Router();
const env = loadEnv()

/**
 * Create swagger config
 */
const swaggerOptions={
    failOnErrors: true,
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Library api',
            version: '1.0.0',
            description: 'A simple Express library API'
        },
        servers: [{
            url: env.APP_PUBLIC_URL
        }],
    },
    apis: [
        "src/app/routes/**/*.yaml",
    ]
}
/**
 * Load swaggerJsDoc
 */
const specs = swaggerJsDoc(swaggerOptions)
/**
 * Define route
 */
route.use('/',swaggerUI.serve,swaggerUI.setup(specs))

export default route;