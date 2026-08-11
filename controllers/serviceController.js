const Service = require("../models/serviceModel");

exports.getServices = (req, res) => {
    Service.getAllServices((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getService = (req, res) => {
    Service.getServiceById(req.params.id, (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.json(results[0]);
    });
};

exports.addService = (req, res) => {
    Service.addService(req.body, (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Service Added Successfully",
            service_id: result.insertId
        });
    });
};

exports.updateService = (req, res) => {
    Service.updateService(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Service Updated Successfully"
        });
    });
};

exports.deleteService = (req, res) => {
    Service.deleteService(req.params.id, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Service Deleted Successfully"
        });
    });
};