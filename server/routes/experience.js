const express= require('express')
const router = express.Router()
const expController = require("../controllers/experienceController")


//create, find, update, delete


router.get('/experiences/create',expController.create_form)
router.post('/experiences/create',expController.create)
router.get('/experiences/read/:id',expController.read)
router.get("/experiences/edit/:id",expController.update_form)
router.post("/experiences/edit/:id",expController.update)
router.get('/experiences/delete/:id',expController.delete)

// router.get('/', (req,res)=>{
//     const context = {}
//     res.render('home',context)
// })

// router.get('/admin', (req,res)=>{
//     const context = {}
//     res.render('admin',context)
// })

module.exports = router