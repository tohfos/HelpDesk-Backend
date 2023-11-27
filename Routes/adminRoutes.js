const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");



router.post('/createUser',authorizationMiddleware(['Admin']),AdminController.CreateUser);



module.exports = router;