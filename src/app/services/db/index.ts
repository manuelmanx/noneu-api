import {Collection, MongoClient, ObjectId} from 'mongodb'
import loadEnv from '../env/index'
import { $CollectionsInterface, $CollectionsKeysType, $GenericCollectionInterface } from './collections.dto'

const collections:$CollectionsInterface = {
    user: undefined,
    refreshToken:undefined
}
/**
 * Load the environment variables
 */
const env = loadEnv()
/**
 * Will return a generic database.
 * @returns The final db.
 */
async function loadDatabase(test?:boolean){
    const db =  await _loadMongo(test)
    return db;
}

/**
 * This method will return the database instance for mongodb
 * @returns The mongo database instance
 */
async function _loadMongo(test?:boolean){
    /**
     * Set the connection parameters for mongo
     */
    const url = env.MONGO_CONNECTION_STRING||'mongodb://localhost:27017'
    const dbName = (!test)? env.DATABASE_NAME || 'tmp_undefined':'test_db_app01'
    const client = new MongoClient(url)
    /**
     * Await for the connection.
     */
    await client.connect()
    const db = await client.db(dbName)
    /**
     * Load all collections and grab then into an object.
     */
    await Object.keys(collections).forEach(async(key:string)=>{
        collections[key as $CollectionsKeysType] = _loadCollection(await db.collection(key))
    })
    return db;
}

/**
 * Create a new custom wrapper for collections.
 * filter -> to find an object array by query @returns an array of data
 * create -> to create a new object into the collection @returns the id of created object
 * delete -> to delete an object by query. @returns the id of deleted object.
 */
function _loadCollection(collection:Collection){
    /**
     * Override the find item method
     * @param filter an object with specified data filter
     * @returns the object required or undefined
     */
    const findMethod = async (filter:any)=>{
        if (!!filter._id) filter._id = new ObjectId(filter._id)
        const data = await collection.findOne(filter) as any;
        if (!data) return undefined;
        data._id = data._id.toString();
        return Object.freeze(data) as any;
    }
    /**
     * Override the filter items method
     * @param filter an object with specified data filter
     * @returns an array of items or undefined
     */
    const filterMethod = async (filter:any)=>{
        if (!!filter._id) filter._id = new ObjectId(filter._id);
        const data = await collection.find(filter).toArray();
        if (!data) return undefined;
        data.forEach((i:any)=>{
            i._id = i._id.toString();
        })
        return Object.freeze(data) as any;
    }
    /**
     * Override the create item method
     * @param data the data to create the object with
     * @returns the object of the created item.
     */
    const createMethod = async(data:any)=>{
        const succcess = await collection.insertOne(data);
        if (!succcess.insertedId) return undefined;
        const filterSuccess = await collection.findOne({_id:succcess.insertedId}) as any;
        filterSuccess._id = filterSuccess._id.toString();
        return Object.freeze(filterSuccess) as any;
    }
    /**
     * Override the delete item method
     * @param filter 
     * @returns id of deleted item as string or undefined.
     */
    const deleteMethod = async(filter:any)=>{
        if (!!filter._id) filter._id = new ObjectId(filter._id);
        const item = await collection.findOne(filter) as any;
        const res = await collection.deleteOne(filter);
        if (res.deletedCount<1) return undefined;
        return item._id.toString() as string;
    }
    /**
     * Override the update method
     * @param filter filter to find the item
     * @param data new data;
     */
    const updateMethod=async(filter:any, data:any)=>{
        if (!!filter._id) filter._id = new ObjectId(filter._id)
        const res = await collection.updateOne(filter, {$set:data})
        return true;
    }
    /**
     * Returns a freezed object with custom methods.
     */
    return Object.freeze({
        find: findMethod,
        filter: filterMethod,
        create: createMethod,
        delete: deleteMethod,
        update: updateMethod
    } as $GenericCollectionInterface)
}


/**
 * Export the collections object outside this module.
 * @returns collections object.
 */
export function getCollections():$CollectionsInterface{
    return collections;
}


export default {loadDatabase, getCollections}