const routeEmployee = require("express").Router();
const EmployeeController = require("../controller/EmployeeController");

routeEmployee.get("/", EmployeeController.getEmployees);
routeEmployee.get("/create", EmployeeController.createPage);
routeEmployee.post("/create", EmployeeController.create);
routeEmployee.get("/delete/:id", EmployeeController.delete);
routeEmployee.get("/update/:id", EmployeeController.updatePage);
routeEmployee.post("/update/:id", EmployeeController.update);

module.exports = routeEmployee;
