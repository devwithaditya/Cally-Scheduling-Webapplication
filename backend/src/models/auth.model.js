const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String
    },
    bio:{
        type:String
    },
    timezone:{
        type:String,
        default:"Asia/Kolkata"
    },
    slug:{
        type:String
    },
    provider:{
        type:String,
        enum:["local","google"],
        default:"local"
    },
    googleAccessToken: String,

    googleRefreshToken: String,
    
    googleTokenExpiry: Date,
    
    calendarConnected: {
      type: Boolean,
      default: false,
    },
}) 

const userModel = mongoose.model("user",authSchema)

module.exports = userModel