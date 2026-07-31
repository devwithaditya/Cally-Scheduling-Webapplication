const bookingModel = require("../models/booking.model")
const userModel = require("../models/auth.model")
const eventModel = require("../models/event.model")
const avalModel = require("../models/availability.model")
const { convertToMinutes, bookingCancelledTemplate } = require("../utils/utils")
const { createCalendarEvent,deleteCalendarEvent } = require("../services/calendar.service")
const sendEmail = require("../services/email.service");
const { bookingConfirmationTemplate } = require("../utils/utils");  

async function booking(req,res){
    try{
    
        const {guestName,guestEmail,date,startTime,notes} = req.body
        const userSlug = req.params.userSlug
        const eventSlug = req.params.eventSlug
    
        const user = await userModel.findOne({
            slug:userSlug
        })
    
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
    
        const event = await eventModel.findOne({
            user:user._id,
            slug:eventSlug
        })
    
        if(!event){
            return res.status(404).json({
                message:"Event not found"
            })
        }
    
        const availability = await avalModel.findOne({
            user:user._id
        })
    
        if(!availability){
            return res.status(409).json({
                message:"Slot not available"
            })
        }
    
        //finding the endTIme
        const duration = event.duration
    
        const [hours,minutes] = startTime.split(":")
    
        const hour = Number(hours)
        const minute = Number(minutes)
    
        const time = new Date(date)
        time.setHours(hour,minute,0,0)
    
        time.setMinutes(time.getMinutes()+duration)
        const endTime = time.toTimeString().slice(0,5)
        
        //checking day & time availability
        const day = new Date(date).toLocaleDateString("en-US", {
            weekday: "long"
        })

        console.log(day);
        console.log(availability.availability);
    
        const slots = availability.availability[day]
        
        if(!slots || slots.length===0){
            return res.status(409).json({
                message:"Host's not available on this day"
            })
        }

        let isAvailable = false

        const bookingStart = convertToMinutes(startTime)
        const bookingEnd = convertToMinutes(endTime)

        for(const slot of slots){
            const slotStart = convertToMinutes(slot.startTime)
            const slotEnd = convertToMinutes(slot.endTime)

            if(bookingStart>=slotStart && bookingEnd<=slotEnd){
                isAvailable = true
                break
            }
        }

        if(!isAvailable){
            return res.status(409).json({
                message:"Selected time is outside the host's availability"
            })
        }

        const existingBookings = await bookingModel.find({
            user: user._id,
            date,
            status: "confirmed"
        });
        
        for (const b of existingBookings) {
        
            const existingStart = convertToMinutes(b.startTime);
            const existingEnd = convertToMinutes(b.endTime);
        
            if (
                bookingStart < existingEnd &&
                bookingEnd > existingStart
            ) {
                return res.status(409).json({
                    message: "This time overlaps with another booking."
                });
            }
        }
    
        const booking = await bookingModel.create({
            user:user._id,
            event:event._id,
            guestName,
            guestEmail,
            date,
            startTime,
            endTime:endTime,
            notes
        })

        if (user.calendarConnected) {
            try {
                const googleEvent = await createCalendarEvent(user, {
                    eventTitle: event.title,
                    description: notes,
                    guestEmail,
                    date,
                    startTime,
                    endTime
                })
        
                booking.googleEventId = googleEvent.id;
                booking.meetLink = googleEvent.hangoutLink;
        
                await booking.save()
    
            } catch (err) {
                console.error("Google Calendar Error:", err)
            }
        }
        try{
            await sendEmail({
            to: guestEmail,
            subject: `Booking Confirmed - ${event.title}`,
            html: bookingConfirmationTemplate({
                guestName,
                hostName: user.username,
                eventTitle: event.title,
                date,
                startTime,
                endTime,
                meetLink: booking.meetLink
            })
        });
        }catch(err){
            console.error("Email Error:", err)
        }
    
        res.status(201).json({
            message:"Booking Created Successfully",
            booking
        })

    }catch(error){
        console.error("Booking Error:", error);
        return res.status(500).json({
            message:error.message
        })
    }   
    
}

async function getBooking(req,res){
    try{
        const userSlug = req.params.userSlug
        const eventSlug = req.params.eventSlug
        const {date} = req.query
    
        const user = await userModel.findOne({
            slug:userSlug
        })
    
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
    
        const event = await eventModel.findOne({
            user:user._id,
            slug:eventSlug
        })
    
        if(!event){
            return res.status(404).json({
                message:"Event not found"
            })
        }
    
        const availability = await avalModel.findOne({
            user:user._id
        })
    
        if(!availability){
            return res.status(404).json({
                message:"Availability not found"
            })
        }
    
        const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "long"
        })
    
        const slots = availability.availability[day];
    
        if (!slots || slots.length === 0) {
            return res.status(409).json({
                message: "Host is not available on this day"
            });
        }
    
        const availableSlots = []
    
        for (const slot of slots) {
    
            let current = convertToMinutes(slot.startTime)
            const slotEnd = convertToMinutes(slot.endTime)
        
            while (current + event.duration <= slotEnd) {
        
                const hours = Math.floor(current / 60)
                    .toString()
                    .padStart(2, "0")
        
                const minutes = (current % 60)
                    .toString()
                    .padStart(2, "0")
        
                availableSlots.push(`${hours}:${minutes}`)
        
                current += event.duration;
            }
        }
    
        const bookings = await bookingModel.find({
            user:user._id,
            date,
            status:"confirmed"
        })
    
        const freeSlots = availableSlots.filter((slot) => {
        
            const slotStart = convertToMinutes(slot);
            const slotEnd = slotStart + event.duration;
        
            for (const booking of bookings) {
        
                const bookedStart = convertToMinutes(booking.startTime)
                const bookedEnd = convertToMinutes(booking.endTime)
        
                if (
                    slotStart < bookedEnd &&
                    slotEnd > bookedStart
                ) {
                    return false
                }
            }
        
            return true
        })

        return res.status(200).json({
           slots: freeSlots
        })

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }

}

async function showBooking(req,res){
    const user = req.user.id

    const bookings = await bookingModel.find({user:user})
    .populate("event","title duration")
    .sort({date:1,startTime:1})

    const bookingList = bookings.map((booking) => ({
        _id: booking._id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        notes: booking.notes,
        status: booking.status,
        meetLink: booking.meetLink,
        event: {
            title: booking.event.title,
            duration: booking.event.duration,
            color: "#7C3AED"
        }
    }));

    res.status(200).json({
        message:"Bookings fetched successfully",
        bookings:bookingList
    })

}

async function showDetailedBooking(req,res){
    const booking = await bookingModel.findById(req.params.id).populate("event")
    
    if(!booking){
        return res.status(404).json({
            message:"Booking not found"
        })
    }

    res.status(200).json({
        message:"Detailed booking",
        booking,
        
    })
}

async function cancelBooking(req,res){
    const userId = req.user.id

    const booking = await bookingModel.findOne({
        _id:req.params.id,
        user:userId
    }).populate("user","username calendarConnected googleRefreshToken")
    .populate("event","title")


    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    //remove booking from calendar
    if (booking.googleEventId && booking.user.calendarConnected) {
        try {
            await deleteCalendarEvent(
                booking.user,
                booking.googleEventId
            );
        } catch (err) {
            console.error("Google Calendar Delete Error:", err);
        }
    }

    //sending cancellation mail to user
    await sendEmail({
        to: booking.guestEmail,
        subject: `Booking Cancelled - ${booking.event.title}`,
        html: bookingCancelledTemplate({
            guestName:booking.guestName,
            hostName:booking.user.username,
            eventTitle:booking.event.title,
            date:booking.date,
            startTime:booking.startTime,
            endTime:booking.endTime
        }),
    })

    //deleting booking from db
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
        message:"Booking Cancel Successfully",
        status:booking.status
    })

    
}

module.exports = {booking,getBooking,showBooking,showDetailedBooking,cancelBooking}