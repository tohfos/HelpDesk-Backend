const express = require("express");
const router = express.Router();
// const LogsModel = require("../models/logsModel");
const logController = require("../controller/logController");

router.get("/", logController.getAllLogs);

module.exports = router;