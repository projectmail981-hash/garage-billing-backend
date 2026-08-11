const Inventory = require("../models/inventoryModel");

exports.getInventory = (req, res) => {

    Inventory.getAllInventory((err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

};

exports.getPart = (req, res) => {

    Inventory.getInventoryById(req.params.id,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            if (results.length == 0)
                return res.status(404).json({
                    message: "Part Not Found"
                });

            res.json(results[0]);

        });

};

exports.addPart = (req, res) => {

    Inventory.addInventory(req.body,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.status(201).json({

                message: "Part Added Successfully",

                part_id: result.insertId

            });

        });

};

exports.updatePart = (req, res) => {

    Inventory.updateInventory(req.params.id,

        req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Part Updated Successfully"

            });

        });

};

exports.deletePart = (req, res) => {

    Inventory.deleteInventory(req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Part Deleted Successfully"

            });

        });

};