const express = require("express")
const eventRouter = express.Router()
const eventController = require("../controller/event.controller")
const authMiddleware = require("../middleware/auth.middleware")

eventRouter.post("/event-type",authMiddleware,eventController.createEvent)
eventRouter.get("/event-type",authMiddleware,eventController.getEvents)
eventRouter.put("/event-type/:id",authMiddleware,eventController.updateEvent)
eventRouter.delete("/event-type/:id",authMiddleware,eventController.deleteEvent)
eventRouter.get("/event-type/:eventSlug/:userSlug",eventController.eventView)
module.exports = eventRouter