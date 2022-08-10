import * as dotenv from 'dotenv';

export default function loadEnv(){
    return Object.freeze(dotenv.config()?.parsed||{});
}