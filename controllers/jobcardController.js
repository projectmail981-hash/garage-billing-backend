const JobCard = require("../models/jobCardModel");

exports.getJobCards = (req, res) => {

    JobCard.getAllJobCards((err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

};

exports.getJobCard = (req, res) => {

    JobCard.getJobCardById(req.params.id,

        (err, results) => {

            if (err)
                return res.status(500).json(err);

            if (results.length == 0)
                return res.status(404).json({
                    message: "Job Card Not Found"
                });

            res.json(results[0]);

        });

};

exports.createJobCard = (req, res) => {

    JobCard.createJobCard(req.body, (err, result) => {

        if (err)
            return res.status(500).json(err);

        const jobId = result.job_id;

        const services = req.body.services || [];
        const parts = req.body.parts || [];

        let pending = services.length + parts.length;

        if (pending === 0) {

            return res.status(201).json({

                message: "Job Card Created Successfully",

                job_id: jobId

            });

        }

        const done = () => {

            pending--;

            if (pending === 0) {

                res.status(201).json({

                    message: "Job Card Created Successfully",

                    job_id: jobId

                });

            }

        };

        services.forEach(service => {

    JobCard.addJobService(jobId, service, (err) => {

        if (err)
            return res.status(500).json(err);

        done();

    });

});

        parts.forEach(part => {

    JobCard.addJobPart(jobId, part, (err) => {

        if (err)
            return res.status(500).json(err);

        done();

    });

});

    });

};

exports.updateJobCard = (req, res) => {

    console.log("ID :", req.params.id);
    console.log("BODY :", req.body);

    JobCard.updateJobCard(

        req.params.id,

        req.body,

        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Job Card Updated"
            });

        }

    );

};

exports.searchJobCards = (req, res) => {

    JobCard.searchJobCards(

        req.params.keyword,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);

        }

    );

};

exports.deleteJobCard = (req, res) => {

    JobCard.deleteJobCard(req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                message: "Job Card Deleted"

            });

        });

};