const userModel = require("../models/auth.model")

async function profile(req,res){
    const user = await userModel.findById({
        _id:req.user.id
    })
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    res.status(200).json({
        message:"Profile viewed successfully",
        username:user.username,
        email:user.email,
        bio:user.bio,
        timezone:user.timezone,
        avatar:user.avatar,
        slug:user.slug,
        calendarConnected: user.calendarConnected
    })
}

async function profileUpdate(req,res){
    const user = await userModel.findByIdAndUpdate(
        req.user.id,
        {
        bio:req.body.bio,
        username:req.body.username,
        avatar:req.body.avatar,
        timezone:req.body.timezone,
        slug:req.body.slug
    },
    {                
        new: true,          // return updated document
        runValidators: true // validate schema

    }
    )

    res.status(200).json({
        message:"Status updated",
        user
    })
}

async function getProfile(req,res){
    const slug = req.params.slug
    
    const user = await userModel.findOne({
        slug
    })

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    res.status(200).json({
        message:"User found",
        username:user.username,
        timezone:user.timezone,
        bio:user.bio,
        avatar:user.avatar
    })
}

module.exports = {profile,profileUpdate,getProfile}