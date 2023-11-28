const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


router.post('/create',authorizationMiddleware(['User']),userController.createTicket);
router.get('/get',authorizationMiddleware(['User']),userController.getTicket);



module.exports = router;