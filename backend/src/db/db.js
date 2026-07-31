const mongoose = require("mongoose")

async function DBConnection(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database is connected Successfully")
    }
    catch(err){
        console.log("Database Connection Failed",err)
    }
}

module.exports = DBConnection
