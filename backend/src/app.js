require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const session = require("express-session")
const passport = require("passport")
const cors = require("cors")
require("./config/passport");
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://meetcally.netlify.app"
  ],
  credentials: true
}));
app.use(passport.initialize())

const authRouter = require("./routes/auth.routes")
const userRouter = require("./routes/user.routes")
const eventRouter = require("./routes/events.routes")
const avalRouter = require("../src/routes/availability.routes")
const bookingRouter = require("../src/routes/booking.routes")

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api",eventRouter)
app.use("/api",avalRouter)
app.use("/api",bookingRouter)

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

module.exports = app;