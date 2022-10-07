const express= require('express')
const router = express.Router()
const expController = require("../controllers/experienceController")

router.get('/experiences/create',expController.create_form)
router.post('/experiences/create',expController.create)
router.get('/experiences/read/:id',expController.read)
router.get("/experiences/update/:id",expController.update_form)
router.post("/experiences/update/:id",expController.update)
router.get('/experiences/delete/:id',expController.delete)

module.exports = router