const express = require("express");
const router = express.Router();
const ManagerController = require("../controller/managerController");
const authorizationJWT = require("../Middleware/authorizeJWT");

router.post('/generateReport/:ticketId',authorizationJWT(['Manager']),ManagerController.generateReport);
router.get('/getReport/:id',authorizationJWT(['Manager']),ManagerController.getReportByID);
router.post('/generateAnalytics1/:id',authorizationJWT(['Manager']),ManagerController.generateAnalyticsForAgent);
router.post('/generateAnalytics2/:SubCategory',authorizationJWT(['Manager']),ManagerController.generateAnalyticsForSubCategory);
router.post('/generateAnalytics3/:Category',authorizationJWT(['Manager']),ManagerController.generateAnalyticsForCategory);

module.exports = router;