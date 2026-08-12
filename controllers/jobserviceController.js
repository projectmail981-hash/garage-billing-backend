const JobService = require("../models/jobserviceModel");

// Get All
exports.getAllJobServices = (req, res) => {

    JobService.getAllJobServices((err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

};

// Get By Job ID
exports.getJobServicesByJobId = (req, res) => {

    JobService.getJobServicesByJobId(

        req.params.jobId,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            res.json(results);

        }

    );

};

// Add
exports.addJobService = (req, res) => {

    JobService.addJobService(

        req.body,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.status(201).json({

                message: "Job Service Added",

                id: result.insertId

            });

        }

    );

};

// Update
exports.updateJobService = (req, res) => {

    JobService.updateJobService(

        req.params.id,

        req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Updated Successfully"

            });

        }

    );

};

// Delete
exports.deleteJobService = (req, res) => {

    JobService.deleteJobService(

        req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Deleted Successfully"

            });

        }

    );

};