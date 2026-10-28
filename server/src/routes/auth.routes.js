const express = require("express")
const router = express.Router()
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.get("/me", authMiddleware.authUser, authController.getMe)
router.post("/logout", authController.logoutUser)

module.exports = router