const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");
const AgentController = require("../../controller/AgentController");
const authorizationJWT = require("../../Middleware/authorizeJWT");


router.post('/createChat/:id', authorizationJWT(['User']), userController.createChat); //this id is ticket id to craete chat with agent
router.post('/message/:id', authorizationJWT(['User']), userController.sendMessage); //id is the chat id 
router.post('/message/:id', authorizationJWT(['Agent']), AgentController.sendMessage); 

module.exports = router