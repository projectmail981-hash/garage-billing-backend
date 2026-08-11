const Vehicle = require("../models/vehicleModel");

// Get all vehicles
exports.getVehicles = (req, res) => {
    Vehicle.getAllVehicles((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Get vehicle by ID
exports.getVehicle = (req, res) => {
    Vehicle.getVehicleById(req.params.id, (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json(results[0]);
    });
};

// Add vehicle
exports.addVehicle = (req, res) => {
    Vehicle.addVehicle(req.body, (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Vehicle Added Successfully",
            vehicle_id: result.insertId
        });
    });
};

// Update vehicle
exports.updateVehicle = (req, res) => {
    Vehicle.updateVehicle(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Vehicle Updated Successfully"
        });
    });
};

// Delete vehicle
exports.deleteVehicle = (req, res) => {
    Vehicle.deleteVehicle(req.params.id, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Vehicle Deleted Successfully"
        });
    });
};

exports.searchVehicle = (req, res) => {

    Vehicle.searchVehicle(req.params.number,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            if (results.length === 0)
                return res.status(404).json({

                    message: "Vehicle Not Found"

                });

            res.json(results[0]);

        });

};

exports.getVehiclesByCustomer = (req, res) => {

    Vehicle.getVehiclesByCustomer(

        req.params.customerId,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);

        }

    );

};