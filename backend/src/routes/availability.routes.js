const express = require("express")
const avalRouter = express.Router()
const avalController = require("../controller/availability.controller")
const authMiddleware = require("../middleware/auth.middleware")

avalRouter.put("/availability",authMiddleware,avalController.availability)
avalRouter.get("/availability",authMiddleware,avalController.getAvailability)

module.exports = avalRouter