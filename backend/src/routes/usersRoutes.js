const express = require("express")
const router = express.Router()
const userController = require("../controllers/usersControllers")

router.post("/", userController.createUser)
router.post("/login", userController.login)

module.exports = router
