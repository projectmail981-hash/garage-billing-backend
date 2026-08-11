const express = require("express");

const router = express.Router();

const invoiceController =
require("../controllers/invoiceController");

// Get All
router.get(
    "/",
    invoiceController.getAllInvoices
);

// Search
router.get(
    "/search/:keyword",
    invoiceController.searchInvoice
);

router.put(
    "/payment/:id",
    invoiceController.receivePayment
);

// Get By ID
router.get(
    "/:id",
    invoiceController.getInvoiceById
);

// Create
router.post(
    "/create",
    invoiceController.createInvoice
);

// Update
router.put(
    "/:id",
    invoiceController.updateInvoice
);

// Delete
router.delete(
    "/:id",
    invoiceController.deleteInvoice
);

module.exports = router;