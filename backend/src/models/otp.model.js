const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        require:[true,"Email is require"]
    },
    otp:{
        type:String
    }
})

const otpModel = mongoose.model("otp",otpSchema)

module.exports = otpModel