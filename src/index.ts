

import loadEnv from './app/services/env';
import dbService from './app/services/db';


const env = loadEnv()
const port = env.APP_PORT||3000;

/**
 * Load database service first.
 */
dbService.loadDatabase().then(success=>console.log(`Successfully connected to ${success.databaseName} database`)).catch(e=>{throw new Error("Connection Error to DB")})
/**
 * Listen for app service.
 */
import AppModule from './app/index';
AppModule.listen(port,()=>console.log(`Server Running on port : 🔗 http://localhost:${port}`))