/**
 * AppModule is the app routing definition
 */
 import express from 'express';
 import adaptRequest from './middlewares/adapt-request'
 import {RouteList} from './uris'
 
 /**
  * Require Express As AppModule
  */
 const AppModule = express();
 const bodyParser = require('body-parser');
 const cors = require('cors');
 const helmet = require('helmet');
 const morgan = require('morgan');
 /**
  * Define Default Route '/'
  */
 AppModule.get('/',(req,res)=>{
     res.send("Hello world")
 })
 
 /**
  * Adding Helmet to enhance your API's security
  */
 AppModule.use(helmet())
 /**
  * Use Request Adapter to make standard the requests.
  */
 AppModule.use(adaptRequest)
 /**
  * Using bodyParser to parse JSON bodies into JS objects
  */
 AppModule.use(bodyParser.json());
 
 /**
  * Enabling CORS for all requests
  */
 AppModule.use(cors());
 
 /**
  * Adding morgan to log HTTP requests
  */
 AppModule.use(morgan('combined'));
 
 /**
  * Add All Routes to App.
  */
  RouteList.forEach(r=>{
    AppModule.use(r.path, r.module)
  })
 /**
  * Export AppModule
  */
 export default AppModule;