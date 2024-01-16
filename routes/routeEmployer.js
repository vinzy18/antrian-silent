const routeEmployer = require("express").Router();
const EmployerController = require("../controller/EmployerController");

routeEmployer.get("/", EmployerController.getEmployers);
routeEmployer.get("/create", EmployerController.createPage);
routeEmployer.post("/create", EmployerController.create);
routeEmployer.get("/delete/:id", EmployerController.delete);
routeEmployer.get("/update/:id", EmployerController.updatePage);
routeEmployer.post("/update/:id", EmployerController.update);

module.exports = routeEmployer;
