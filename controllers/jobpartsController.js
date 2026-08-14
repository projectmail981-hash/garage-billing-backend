const JobPart = require("../models/jobpartsModel");

// Get All
exports.getAllJobParts = (req, res) => {

    JobPart.getAllJobParts((err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

};

// Get by Job ID
exports.getJobPartsByJobId = (req, res) => {

    JobPart.getJobPartsByJobId(

        req.params.jobId,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            res.json(results);

        }

    );

};

// Add
exports.addJobPart = (req, res) => {

    JobPart.addJobPart(

        req.body,

        (err, result) => {
            if (err) {
                console.error("Add Job Part Error:", err);
                return res.status(500).json(err);
            }

            res.status(201).json({

                message: "Job Part Added",

                id: result.insertId

            });

        }

    );

};

// Update
exports.updateJobPart = (req, res) => {
    JobPart.updateJobPart(
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

// Toggle Status
exports.toggleJobPartStatus = (req, res) => {
    const isCompleted = req.body.is_completed;
    JobPart.toggleJobPartStatus(
        req.params.id,
        isCompleted,
        (err) => {
            if (err)
                return res.status(500).json(err);
            res.json({
                message: "Status Toggled Successfully"
            });
        }
    );
};

// Delete
exports.deleteJobPart = (req, res) => {

    JobPart.deleteJobPart(

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