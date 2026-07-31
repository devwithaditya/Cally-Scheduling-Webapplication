const express = require("express")
const authRouter = express.Router()
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const passport = require("passport")

authRouter.post("/register",authController.register)
authRouter.post("/otp-verify",authController.otpVerify)
authRouter.post("/login",authController.login)
authRouter.post("/refresh-token",authController.refreshToken)
authRouter.post("/logout",authController.logout)

authRouter.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
authRouter.get("/google/callback",passport.authenticate("google",{session:false}),authController.googleCallback)

authRouter.get("/google/calendar", authController.connectGoogleCalendar);
authRouter.get("/google/calendar/callback", authController.googleCalendarCallback);

module.exports = authRouter;