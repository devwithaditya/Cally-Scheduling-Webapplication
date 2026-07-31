const express = require("express")
const userRouter = express.Router()
const userController = require("../controller/user.controller")
const authMiddleware = require("../middleware/auth.middleware")

userRouter.get("/me",authMiddleware,userController.profile)
userRouter.put("/me",authMiddleware,userController.profileUpdate)
userRouter.get("/:slug",userController.getProfile)

module.exports = userRouter