const express= require('express')
const router = express.Router()
const aboutController = require("../controllers/aboutController")


router.get('/about/create',aboutController.create_form)
router.post('/about/create',aboutController.create)
router.get("/about/edit/:id",aboutController.update_form)
router.post("/about/edit/:id",aboutController.update)
router.get('/about/delete/:id',aboutController.delete)

module.exports = router