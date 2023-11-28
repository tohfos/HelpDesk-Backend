const express = require("express");
const router = express.Router();
const AgentController = require("../controller/AgentController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");



router.get('/get',authorizationMiddleware(['Agent']),AgentController.getTicket);
router.put('/startTicket/:id',authorizationMiddleware(['Agent']),AgentController.startTicket);
router.put('/solveTicket/:id',authorizationMiddleware(['Agent']),AgentController.solveTicket);

module.exports = router;