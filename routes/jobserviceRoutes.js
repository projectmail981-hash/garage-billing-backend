const express = require("express");

const router = express.Router();

const controller =
require("../controllers/jobserviceController");

router.get("/", controller.getAllJobServices);

router.get("/:jobId", controller.getJobServicesByJobId);

router.post("/", controller.addJobService);

router.put("/:id", controller.updateJobService);

router.delete("/:id", controller.deleteJobService);

module.exports = router;