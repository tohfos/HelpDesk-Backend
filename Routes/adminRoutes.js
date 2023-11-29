const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const authorizationJWT = require("../Middleware/authorizeJWT");




router.post('/createUser',authorizationJWT(['Admin']),AdminController.CreateUser);
router.post('/addQuestionsToFAQ',authorizationJWT(['Admin']),AdminController.AddQuestionsToFAQ);




module.exports = router;