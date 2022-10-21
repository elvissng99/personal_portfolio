const express= require('express')
const router = express.Router()
const navigationController = require("../controllers/navigationController")

router.get('/', navigationController.home)
router.get('/about', navigationController.about)
router.get('/experiences', navigationController.experiences)
router.get('/contact', navigationController.contact)

router.get('/login', navigationController.login)
router.post('/login',navigationController.validate)
router.post('/logout',navigationController.logout)

router.get('/admin',navigationController.home_admin)
router.get('/experiences/admin', navigationController.experiences_admin)
router.get('/about/admin', navigationController.about_admin)

module.exports = router
