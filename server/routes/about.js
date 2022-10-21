const express= require('express')
const router = express.Router()
const aboutController = require("../controllers/aboutController")

router.get('/about/create',aboutController.create_form)
router.post('/about/create',aboutController.create)
router.get("/about/update/:id",aboutController.update_form)
router.post("/about/update/:id",aboutController.update)
router.post('/about/delete/:id',aboutController.delete)

router.post('/about/admin',aboutController.createSkill)
router.post('/skills/delete/:id',aboutController.deleteSkill)


module.exports = router