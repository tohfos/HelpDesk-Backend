const express = require("express");
const router = express.Router();
const AgentController = require("../controller/AgentController");



router.get('/get/:id',AgentController.getTicket);
router.put('/startTicket/:id',AgentController.startTicket);
router.put('/solveTicket/:id',AgentController.solveTicket);

module.exports = router;