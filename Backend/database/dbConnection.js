import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Hospital_app"
    }).then(() => {
        console.log("Connected to database")
        // console.log(`MongoDB connected: ${conn.connection.host}`);
    }).catch(err => {
        console.log(`Some error occured while connecting to database: ${err}`);
    })
};