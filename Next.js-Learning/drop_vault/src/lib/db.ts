import { connect } from "mongoose";

const mongodbUrl =  process.env.MONGODB_URL;
if(!mongodbUrl){
    throw new Error("mongodb url is not found");
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };

}

const connectDb = async () => {
    if(cached.conn){
        console.log("connnected")
        return cached.conn
    }

    if(!cached.promise){
        cached.promise = connect(mongodbUrl).then((c) => c.connection);
    }

    try{
        cached.conn = await cached.promise;
        console.log("connected")
    }catch(err){
        throw err;
    }   

    return cached.conn
}

export default connectDb;