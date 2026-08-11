const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");


router.get("/", vehicleController.getVehicles);

router.get("/search/:number", vehicleController.searchVehicle);

router.get(
    "/customer/:customerId",
    vehicleController.getVehiclesByCustomer
);

router.get("/:id", vehicleController.getVehicle);

router.post("/", vehicleController.addVehicle);

router.put("/:id", vehicleController.updateVehicle);

router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;