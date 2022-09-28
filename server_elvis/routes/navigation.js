const express= require('express')
const router = express.Router()
const navigationController = require("../controllers/navigationController")

router.get('/', navigationController.home)
router.get('/resume', navigationController.resume)

module.exports = router
