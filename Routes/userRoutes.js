const express = require("express");
const router = express.Router();
const { userController, userEvents } = require('../controller/userController');
const authorizationJWT = require("../Middleware/authorizeJWT");

//TODO make reset password accessible to all users
router.put('/resetPassword', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.resetPassword);
router.post('/create', authorizationJWT(['User']), userController.createTicket);
router.get('/get', authorizationJWT(['User']), userController.getTicket);
router.get('/getOne/:id', authorizationJWT(['User']), userController.getOneTicket);
router.put('/rate/:id', authorizationJWT(['User']), userController.rateTicket);
router.get('/profile', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.getProfile);
router.put('/updateProfile', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.updateProfile);
router.get('/KnowledgeBase', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.getFAQ);
router.post('/postQuestion', authorizationJWT(['User', 'Manager']), userController.postQuestion);
router.get('/KnowledgeBase/:Category', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.filterByCategory);
router.get('/KnowledgeBase/:Category/:SubCategory', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.filterBySubCategory);
router.get('/workflow/:Category/:SubCategory', authorizationJWT(['User']), userController.getAutomationAndWorkflow);
router.post('/openchat/:id', authorizationJWT(['User']), userController.OpenChat);
router.get('/GetAllChats', authorizationJWT(['User']), userController.GetAllChats);

router.get('/getnotifcations', authorizationJWT(['User', 'Agent']), userController.getnotifcations);



module.exports = router;