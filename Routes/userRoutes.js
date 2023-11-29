const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authorizationJWT = require("../Middleware/authorizeJWT");


router.post('/create', authorizationJWT(['User']), userController.createTicket);
router.get('/get', authorizationJWT(['User']), userController.getTicket);
router.get('/profile',authorizationJWT(['User']), userController.getProfile);
router.put('/updateProfile',authorizationJWT(['User']), userController.updateProfile);
router.get('/KnowledgeBase',authorizationJWT(['User']), userController.getFAQ);


module.exports = router;