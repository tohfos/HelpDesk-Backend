const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const authorizationMiddleware = require("../Middleware/authorizeJWT");




router.post('/createUser',authorizationMiddleware(['Admin']),AdminController.CreateUser);




module.exports = router;