import bcrypt from 'bcrypt'

export default function crypto(){
    return Object.freeze({
        encrypt:encrypt, 
        compare:compare,
        b64encode:b64encode,
        b64decode:b64decode,
    });
    
    async function encrypt(key:string):Promise<string>{
       const salt =  await bcrypt.genSalt(10)
       return await bcrypt.hash(key, salt)
    }
    async function compare(key:string, hash:string):Promise<boolean>{
        return await bcrypt.compare(key, hash)
    }

    function b64encode(key:string):string{
        return Buffer.from(key).toString("base64")
    }

    function b64decode(b64string:string):string{
        return Buffer.from(b64string, 'base64').toString('ascii')
    }
}