const express= require('express')
const router = express.Router()
const expController = require("../controllers/experienceController")


//create, find, update, delete
router.get('/admin', expController.view)
router.get('/addExperience',expController.form)
router.post('/admin',expController.create)
router.get("/editExperience/:id",expController.edit)

router.get('/', (req,res)=>{
    const context = {}
    res.render('main',context)
})

router.get('/admin', (req,res)=>{
    const context = {}
    res.render('admin',context)
})

module.exports = router