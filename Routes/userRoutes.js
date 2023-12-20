const express = require("express");
const router = express.Router();
const { userController, userEvents } = require('../controller/userController');
const authorizationJWT = require("../Middleware/authorizeJWT");

//TODO make reset password accessible to all users
router.put('/resetPassword', authorizationJWT(['User','Manager','Agent']), userController.resetPassword);
router.post('/create', authorizationJWT(['User']), userController.createTicket);
router.get('/get', authorizationJWT(['User']), userController.getTicket);
router.get('/getOne/:id', authorizationJWT(['User']), userController.getOneTicket);
router.put('/rate/:id', authorizationJWT(['User']), userController.rateTicket);
router.get('/profile',authorizationJWT(['User','Manager','Agent','Admin']), userController.getProfile);
router.put('/updateProfile',authorizationJWT(['User','Manager','Agent','Admin']), userController.updateProfile);
router.get('/KnowledgeBase',authorizationJWT(['User']), userController.getFAQ);
router.get('/KnowledgeBase/:Category',authorizationJWT(['User']), userController.filterByCategory);
router.get('/KnowledgeBase/:Category/:SubCategory',authorizationJWT(['User']), userController.filterBySubCategory);
router.get('/workflow/:Category/:SubCategory', authorizationJWT(['User']), userController.getAutomationAndWorkflow);
router.post('/openchat/:id', authorizationJWT(['User']), userController.OpenChat);




module.exports = router;