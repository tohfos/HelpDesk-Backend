const express = require("express");
const router = express.Router();
const ManagerController = require("../controller/managerController");
const authorizationJWT = require("../Middleware/authorizeJWT");

router.post('/generateReport/:ticketId', authorizationJWT(['Manager']), ManagerController.generateReport);
router.get('/getReports', authorizationJWT(['Manager']), ManagerController.getReports);
router.get('/getReport/:id', authorizationJWT(['Manager']), ManagerController.getReportByID);
router.post('/generateAnalytics1/:id', authorizationJWT(['Manager']), ManagerController.getAnalyticsDetailsAgent);
router.post('/generateAnalytics2/:SubCategory', authorizationJWT(['Manager']), ManagerController.getAnalyticsDetailsSubCategory);
router.post('/generateAnalytics3/:Category', authorizationJWT(['Manager']), ManagerController.getAnalyticsDetailsCategory);

module.exports = router;