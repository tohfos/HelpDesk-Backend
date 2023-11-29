const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authorizationJWT = require("../Middleware/authorizeJWT");


router.post('/create', authorizationJWT(['User']), userController.createTicket);
router.get('/get', authorizationJWT(['User']), userController.getTicket);
router.put('/rate/:id', authorizationJWT(['User']), userController.rateTicket);
router.get('/profile',authorizationJWT(['User']), userController.getProfile);
router.put('/updateProfile',authorizationJWT(['User']), userController.updateProfile);
router.get('/KnowledgeBase',authorizationJWT(['User']), userController.getFAQ);
router.get('/KnowledgeBase/:Category',authorizationJWT(['User']), userController.filterByCategory);
router.get('/KnowledgeBase/:Category/:SubCategory',authorizationJWT(['User']), userController.filterBySubCategory);


module.exports = router;