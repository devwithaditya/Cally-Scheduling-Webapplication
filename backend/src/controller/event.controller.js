const eventModel = require("../models/event.model")
const userModel = require("../models/auth.model")
async function createEvent(req,res){
    const{title,duration,description,color} = req.body
    const user = req.user.id
    
    const slug = title.trim().replaceAll(' ','-').toLowerCase()
    
    const isAvailable = await eventModel.findOne(
        {
            user:user,
            slug:slug

        }
    )
    
    if(isAvailable){
        return res.status(409).json({
            message:"Event Already Exist"
        })
    }

    const event = await eventModel.create({
        user,
        title,
        duration,
        description,
        color,
        slug
    }) 

    return res.status(201).json({
        message:"Event created successfully",
        user:event.user,
        title:event.title,
        duration:event.duration,
        description:event.description,
        color:event.color,
        slug:event.slug
    })
}

async function getEvents(req,res){
    const user = req.user.id

    const events = await eventModel.find({
        user:user
    })

    res.status(200).json({
        message:"Events fetched successfully",
        events
    })

}

async function updateEvent(req,res){
    const {title,duration,description,color,isActive} = req.body
    
    const generatedSlug = title.trim().replaceAll(' ','-').toLowerCase() 

    const isExist = await eventModel.findOne(
        {
        user:req.user.id,
        slug:generatedSlug,
        _id:{$ne:req.params.id}
        }
    )

    if(isExist){
        return res.status(409).json({
            message:"Event already exist"
        })
    }

    const event = await eventModel.findOneAndUpdate(
        {
            _id:req.params.id,
            user:req.user.id
        
        },

        {
            title,
            duration,
            description,
            color,
            isActive,
            slug:generatedSlug
        },

        {
            new:true
        }
    )
    if(!event){
        return res.status(404).json({
            message:"Event not found"
        })
    }
    res.status(200).json({
        message:"Event updated",
        title:event.title,
        duration:event.duration,
        description:event.description,
        color:event.color,
        isActive:event.isActive,
        slug:event.slug
    })
}

async function deleteEvent(req,res){
    const event = req.params.id
    const user = req.user.id

    const valid = await eventModel.findOneAndDelete({
        _id:event,user
    })

    if(!valid){
        return res.status(404).json({
            message:"Event not found"
        })
    }

    res.status(200).json({
        message:"Event deleted successfully"
    })

}

async function eventView(req,res){
    const eventSlug = req.params.eventSlug
    const userSlug = req.params.userSlug
    const user = await userModel.findOne({
        slug:userSlug
    })
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    console.log("User:", user);
    console.log("eventSlug:", eventSlug);
    console.log("user._id:", user._id);
    const event = await eventModel.findOne({
        slug:eventSlug,
        user:user._id
    })
    console.log("Event:", event);
    if(!event){
        return res.status(404).json({
            message:"Event not found"
        })
    }
    res.status(200).json({
        message:"Event fetch successfully",
        title:event.title,
        duration:event.duration,
        description:event.description,
        user:user.username,
        timezone:user.timezone
    })
}

module.exports = {createEvent,getEvents,updateEvent,deleteEvent,eventView}