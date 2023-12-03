const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.route('/').post(authController.login)


router.route('/refresh').get(authController.refresh)

router.route('/verify').get(authController.verify)
router.route('/verifyotp/:id').get(authController.verifyOTP)

router.route('/logout').post(authController.logout)

module.exports = router
