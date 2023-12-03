const express = require("express");
const router = express.Router();
const ManagerController = require("../controller/managerController");
const authorizationJWT = require("../Middleware/authorizeJWT");

router.post('/generateReport/:ticketId',authorizationJWT(['Manager']),ManagerController.generateReport);
router.get('/getReport/:id',authorizationJWT(['Manager']),ManagerController.getReportByID)