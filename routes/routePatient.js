const routePatient = require("express").Router();
const PatientController = require("../controller/PatientController");

routePatient.get("/", PatientController.getPatients);
routePatient.get("/create", PatientController.createPage);
routePatient.post("/create", PatientController.create);
routePatient.get("/delete/:id", PatientController.delete);
routePatient.get("/update/:id", PatientController.updatePage);
routePatient.post("/update/:id", PatientController.update);

module.exports = routePatient;
