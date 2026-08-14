const Customer = require("../models/customerModel");

// Get all customers
exports.getCustomers = (req, res) => {

    Customer.getAllCustomers((err, results) => {

        if (err) {
            console.error("Customers Error:", err);
            return res.status(500).json(err);
        }
        res.json(results);

    });

};

// Get customer by ID
exports.getCustomer = (req, res) => {

    Customer.getCustomerById(req.params.id, (err, results) => {

        if (err)
            return res.status(500).json(err);

        if (results.length === 0)
            return res.status(404).json({
                message: "Customer not found"
            });

        res.json(results[0]);

    });

};

// Add customer
exports.addCustomer = (req, res) => {

    Customer.addCustomer(req.body, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(201).json({

            message: "Customer Added Successfully",

            customer_id: result.insertId

        });

    });

};

exports.registerCustomer = (req, res) => {

    console.log(req.body);

    Customer.registerCustomer(req.body, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(201).json({
            message: "Customer Registered Successfully",
            customer_id: result.customer_id
            
        });

    });

};
// Update customer
exports.updateCustomer = (req, res) => {

    Customer.updateCustomer(req.params.id, req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Customer Updated Successfully"

            });

        });

};

exports.searchCustomers = (req, res) => {

    Customer.searchCustomers(

        req.params.keyword,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);

        }

    );

};

// Delete customer
exports.deleteCustomer = (req, res) => {

    Customer.deleteCustomer(req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Customer Deleted Successfully"

            });

        });

};