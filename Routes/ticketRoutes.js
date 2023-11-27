const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticketController");


router.post('/create/:id',ticketController.createTicket);
router.get('/get/:id',ticketController.getTicket);
router.put('/update/:id',ticketController.startTicket);
router.put('/update/:id',ticketController.closeTicket);


module.exports = router;