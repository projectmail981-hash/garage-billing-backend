const Dashboard = require("../models/dashboardModel");

exports.getDashboard = (req, res) => {

    Dashboard.getDashboard((err, result) => {

        if (err) {
            console.error("Dashboard Error:", err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

exports.globalSearch = (req, res) => {

    Dashboard.globalSearch(

        req.params.keyword,

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);

        }

    );

};