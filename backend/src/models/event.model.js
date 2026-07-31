const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User Required"]
        
    },
    title:{
        type:String,
        required:[true,"Title required"]
    },
    slug:{
        type:String
    },
    duration:{
        type:Number,
        required:[true,"Duration required"]
    },
    description:{
        type:String
    },
    color:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const eventModel = mongoose.model("event",eventSchema)

module.exports = eventModel