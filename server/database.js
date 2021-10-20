const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// connection to the database
const mongodbConnection = ()=>{
    mongoose.connect(
        process.env.DATABASE_URL,{
            useNewUrlParser: true,
            // useCreateIndex:true,
            // useFindAndModify: true,
            useUnifiedTopology: true,
        });

        const connection = mongoose.connection;
        connection.once('open',()=>{
            console.log("connect to database...");
        });
}

module.exports = mongodbConnection;
