const Invoice = require("../models/invoiceModel");

// Get All
exports.getAllInvoices = (req, res) => {

    Invoice.getAllInvoices((err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

};

// Get By ID
exports.getInvoiceById = (req, res) => {

    Invoice.getInvoiceById(

        req.params.id,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            if (results.length === 0)
                return res.status(404).json({
                    message: "Invoice Not Found"
                });

            res.json(results[0]);

        }

    );

};

// Create
exports.createInvoice = (req, res) => {

    console.log(req.body); 

    Invoice.createInvoice(

        req.body,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.status(201).json({

                message: "Invoice Created Successfully",

                invoice_id: result.insertId

            });

        }

    );

};

exports.receivePayment = (req, res) => {

    Invoice.receivePayment(

        req.params.id,

        req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Payment Updated Successfully"

            });

        }

    );

};

exports.searchInvoice = (req,res)=>{

    Invoice.searchInvoice(

        req.params.keyword,

        (err,result)=>{

            if(err)
                return res.status(500).json(err);

            res.json(result);

        }

    );

};

// Update Payment
exports.updateInvoice = (req, res) => {

    Invoice.updateInvoice(

        req.params.id,

        req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Invoice Updated Successfully"

            });

        }

    );

};

// Delete
exports.deleteInvoice = (req, res) => {

    Invoice.deleteInvoice(

        req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Invoice Deleted Successfully"

            });

        }

    );

};