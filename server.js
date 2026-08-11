const express=require("express");
const cors=require("cors");
require("dotenv").config();

const app=express();

app.use(cors());

app.use(express.json());

const customerRoutes =require("./routes/customerRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const jobCardRoutes = require("./routes/jobCardRoutes");
const jobServiceRoutes = require("./routes/jobServiceRoutes");
const jobPartRoutes = require("./routes/jobpartsRoutes");
const invoiceRoutes =require("./routes/invoiceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/dashboard", dashboardRoutes);
app.use("/customers", customerRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/services", serviceRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/jobcards", jobCardRoutes);
app.use("/jobservices", jobServiceRoutes);
app.use("/jobparts", jobPartRoutes);

app.listen(process.env.PORT,()=>{

console.log("Server Running");

});