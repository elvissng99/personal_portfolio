const express= require('express')
const router = express.Router()
const expController = require("../controllers/experienceController")


//create, find, update, delete
router.get('/admin', expController.admin)
router.get('/login', expController.login)
router.post('/login',expController.validate)
router.get('/logout',expController.logout)
router.get('/addExperience',expController.form)
router.get('/deleteExperience/:id',expController.delete)

router.post('/admin',expController.create)
router.get("/editExperience/:id",expController.edit)
router.post("/editExperience/:id",expController.update)
router.get('/viewExperience/:id',expController.view)

router.get('/', (req,res)=>{
    const context = {}
    res.render('main',context)
})

router.get('/admin', (req,res)=>{
    const context = {}
    res.render('admin',context)
})

module.exports = router