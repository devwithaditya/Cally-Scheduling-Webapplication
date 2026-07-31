const avalModel = require("../models/availability.model")

async function availability(req,res){  
    try{
        const userId = req.user.id
        const {availability} = req.body

        const userAvailability = await avalModel.findOne({
            user:userId
        })
    
        if(userAvailability){
            userAvailability.availability = availability
            await userAvailability.save()
        }
        else{
            await avalModel.create({
                user:userId,
                availability
            })
        }
    
        res.status(201).json({
            message:"Availability updated successfully",
            availability:userAvailability
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

async function getAvailability(req,res){
    const userId = req.user.id

    const userAvailability = await avalModel.findOne({user:userId})

    if(!userAvailability){
        return res.status(200).json({
            message:"Availability not found",
            availability:{
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            }
        })
    }

    return res.status(200).json({
        message:"Availability fetched successfully",
        availability:userAvailability.availability
    })
}

module.exports = {availability,getAvailability}