const express = require("express");
const router = express.Router();
const AgentController = require("../controller/AgentController");
const authorizationJWT = require("../Middleware/authorizeJWT");



router.get('/get',authorizationJWT(['Agent']),AgentController.getTicket);
router.put('/startTicket/:id',authorizationJWT(['Agent']),AgentController.startTicket);
router.put('/solveTicket/:id',authorizationJWT(['Agent']),AgentController.solveTicket);
router.post('/communicate/:id',authorizationJWT(['Agent']),AgentController.communicate);
router.post('/addWorkFlow', authorizationJWT(['Agent']), AgentController.addWorkFlow);
router.get('/getOne/:id', authorizationJWT(['Agent']), AgentController.getOneTicket);
router.get('/GetAllChats', authorizationJWT(['Agent']), AgentController.GetAllChats);


module.exports = router;