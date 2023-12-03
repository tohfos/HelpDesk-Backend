const express = require("express");
const authorizationJWT = require("../Middleware/authorizeJWT");

const router = express.Router();





router.get('/getReports', authorizationJWT(['Manager']), ManagerController.getReports);
router.get('/getReportByTicket/:ticketId', authorizationJWT(['Manager']), ManagerController.getReportByTicket);
router.get('/getReportByAgent/:userId', authorizationJWT(['Manager']), ManagerController.getReportByAgent);




module.exports = router;