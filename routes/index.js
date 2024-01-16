const routes = require("express").Router();
const routeEmployees = require("./routeEmployee");
const routeJobs = require("./routeJob");
const routeEmployers = require("./routeEmployer");
const routePatients = require("./routePatient");

routes.get("/", (req, res) => {
  //   res.send("Hello World");
  res.render("index.ejs");
});

routes.use("/employees", routeEmployees);
routes.use("/jobs", routeJobs);
routes.use("/employers", routeEmployers);
routes.use("/patients", routePatients);

module.exports = routes;
