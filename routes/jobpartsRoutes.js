const express = require("express");

const router = express.Router();

const controller =
require("../controllers/jobpartsController");

router.get("/", controller.getAllJobParts);

router.get("/:jobId", controller.getJobPartsByJobId);

router.post("/", controller.addJobPart);

router.put("/:id", controller.updateJobPart);

router.delete("/:id", controller.deleteJobPart);

module.exports = router;