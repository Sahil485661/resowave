const mongoose = require("mongoose")

async function connectdb(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is connected")
    }
    catch(error){
        console.log("Database not connect", error)
    }
}
module.exports = connectdb