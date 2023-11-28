const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyJWT = require('../Middleware/authenticateJWT')




router.post('/create/:id',userController.createTicket);
router.get('/get/:id',userController.getTicket);



module.exports = router;