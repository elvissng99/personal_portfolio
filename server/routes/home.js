const express= require('express')
const router = express.Router()
const homeController = require("../controllers/homeController")

router.post('/admin',homeController.update)

module.exports = router
