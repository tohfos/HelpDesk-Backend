const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const authorizationJWT = require("../Middleware/authorizeJWT");




router.post('/createUser', authorizationJWT(['Admin']), AdminController.CreateUser);
router.post('/addQuestionsToFAQ', authorizationJWT(['Admin']), AdminController.AddQuestionsToFAQ);
router.post('/changeTheme', authorizationJWT(['Admin']), AdminController.ChangeTheme)
router.post('/AddDataToKnowledgeBase', authorizationJWT(['Admin']), AdminController.AddDataToKnowledgeBase)
router.post('/backup', authorizationJWT(['Admin']), AdminController.backup)
router.post('/restore', authorizationJWT(['Admin']), AdminController.restore)
router.put('/updateRole/:id', authorizationJWT(['Admin']), AdminController.updateRole);
router.get('/getallusers', authorizationJWT(['Admin']), AdminController.getAllUsers);
router.get('/getLogs', authorizationJWT(['Admin']), AdminController.getLogs);


module.exports = router;