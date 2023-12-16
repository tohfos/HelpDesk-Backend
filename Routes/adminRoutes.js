const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const authorizationJWT = require("../Middleware/authorizeJWT");




router.post('/createUser', authorizationJWT(['Admin']), AdminController.CreateUser);
router.post('/addQuestionsToFAQ', authorizationJWT(['Admin']), AdminController.AddQuestionsToFAQ);
router.post('/changeTheme', authorizationJWT(['Admin']), AdminController.ChangeTheme)
router.post('/createQueue', authorizationJWT(['Admin']), AdminController.AddQueue)
router.post('/AddDataToKnowledgeBase', authorizationJWT(['Admin']), AdminController.AddDataToKnowledgeBase)
router.post('/backup', authorizationJWT(['Admin']), AdminController.backup)
router.post('/restore', authorizationJWT(['Admin']), AdminController.restore)
router.post('/updateRole', authorizationJWT(['Admin']), AdminController.updateRole);
router.post('/getallusers', authorizationJWT(['Admin']), AdminController.getAllUsers);


module.exports = router;