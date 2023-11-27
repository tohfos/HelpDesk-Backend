const express = require("express");
const router = express.Router();
const AgentController = require("../controller/AgentController");


router.post('/create/:id',AgentController.createTicket);
router.get('/get/:id',AgentController.getTicket);