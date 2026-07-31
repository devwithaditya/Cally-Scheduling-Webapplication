const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"event",
        required:true
    },
    guestName:{
        type:String,
        required:[true,"Name required"]
    },
    guestEmail:{
        type:String,
        required:[true,"Email required"]
    },
    date:{
        type:Date,
        required:[true,"Date required"]
    },
    startTime:{
        type:String,
        required:[true,"Start time required"]
    },
    endTime:{
        type:String,
        required:[true,"End time required"]
    },
    notes:{
        type:String
    },
    status:{
        type:String,
        enum: ["confirmed", "cancelled", "completed"],
        default:"confirmed"
    },
    googleEventId:{
        type:String
    },
    meetLink:{
        type:String
    }

},{
    timestamps:true
})

const bookingModel = mongoose.model("booking",bookingSchema)

module.exports = bookingModel