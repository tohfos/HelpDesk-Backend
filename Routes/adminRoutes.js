const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");



router.post('/createUser',AdminController.CreateUser);



module.exports = router;