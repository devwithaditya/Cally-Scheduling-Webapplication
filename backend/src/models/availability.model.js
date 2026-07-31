const mongoose = require("mongoose")

const timeSlotSchema = new mongoose.Schema({
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    }
},{_id:false})

const AvailabilitySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User required"],
        unique:true
    },
    availability:{
        Monday:{
            type:[timeSlotSchema],
            default:[]
        },
        Tuesday:{
            type:[timeSlotSchema],
            default:[]
        },
        Wednesday:{
            type:[timeSlotSchema],
            default:[]
        },
        Thursday:{
            type:[timeSlotSchema],
            default:[]
        },
        Friday:{
            type:[timeSlotSchema],
            default:[]
        },
        Saturday:{
            type:[timeSlotSchema],
            default:[]
        },
        Sunday:{
            type:[timeSlotSchema],
            default:[]
        }
    }
},{
    timestamps:true
})

const avalModel = mongoose.model("availability",AvailabilitySchema)

module.exports = avalModel