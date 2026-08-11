const express = require("express");

const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

router.get("/", inventoryController.getInventory);

router.get("/:id", inventoryController.getPart);

router.post("/", inventoryController.addPart);

router.put("/:id", inventoryController.updatePart);

router.delete("/:id", inventoryController.deletePart);

module.exports = router;