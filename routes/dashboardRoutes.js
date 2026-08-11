const express = require("express");

const router = express.Router();

const dashboardController =
require("../controllers/dashboardController");

router.get("/",
dashboardController.getDashboard);

router.get(
    "/search/:keyword",
    dashboardController.globalSearch
);

module.exports = router;