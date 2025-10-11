import mongoose from "mongoose";

 if(process.env.NODE_ENV!=="production"){
        mongoose.set("debug",true);
    }

const connectDB=async()=>{
   
    if(!process.env.MONGODB_URI && !process.env.MONGO_URI){
        throw new Error("MONGO_URI is not defined in environment variables");
    }
        const connectionOptions={
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:5000,
            connectTimeoutMS:10000,
            maxPoolSize:10,
            minPoolSize:5
        };
        let reconnecting=false;
        const connectionWithRetry=async()=>{
            console.log("Attempting to connect to MongoDB...");
            console.log(`MONGO_URI: ${process.env.MONGODB_URI || process.env.MONGO_URI}`);
            try{
                await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI,connectionOptions);
                console.log("MongoDB connected successfully");
            }
            catch(err){
                console.error(`MongoDB connection error: ${err}`);
                console.log("Retrying in 5 seconds...");
                setTimeout(connectionWithRetry,5000);
            }
        }
        mongoose.connection.on("error",(err=>{
            console.error(`MongoDB connection error: ${err}`);
        }));
        mongoose.connection.on("disconnected",()=>{
            console.log("MongoDB disconnected");
            if(!reconnecting){
                reconnecting=true;
                console.log("Attempting to reconnect to MongoDB...");
                connectionWithRetry().finally(()=>{reconnecting=false;});
            }
        });
        await connectionWithRetry();
    }

export { connectDB };
