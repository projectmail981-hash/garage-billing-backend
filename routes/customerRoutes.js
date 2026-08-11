const express = require("express");

const router = express.Router();

const customerController =
require("../controllers/customerController");

router.get("/", customerController.getCustomers);

router.post("/register", customerController.registerCustomer);  

router.get(
    "/search/:keyword",
    customerController.searchCustomers
);

router.get("/:id", customerController.getCustomer);

router.post("/", customerController.addCustomer);

router.put("/:id", customerController.updateCustomer);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;