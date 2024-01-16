const routeJob = require("express").Router();
const JobController = require("../controller/JobController");

routeJob.get("/", JobController.getJobs);
routeJob.get("/create", JobController.createPage);
routeJob.post("/create", JobController.create);
routeJob.get("/delete/:id", JobController.delete);
routeJob.get("/update/:id", JobController.updatePage);
routeJob.post("/update/:id", JobController.update);

module.exports = routeJob;
