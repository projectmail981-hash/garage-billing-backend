const express = require("express");

const router = express.Router();

const jobCardController =
require("../controllers/jobcardController");

router.get("/", jobCardController.getJobCards);

router.get(
    "/search/:keyword",
    jobCardController.searchJobCards
);

router.get("/:id", jobCardController.getJobCard);

router.post("/create", jobCardController.createJobCard);

router.put("/:id", jobCardController.updateJobCard);

router.delete("/:id", jobCardController.deleteJobCard);

module.exports = router;