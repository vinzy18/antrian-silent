const { PatientModel } = require("../model");

class PatientController {
  static getPatients(req, res) {
    PatientModel.getPatients()
      .then((patients) => {
        if(patients){
          res.render("patients/index.ejs", { patients });
        } else {
          res.render("patients/createPage.ejs", { patients });
        }
        // res.send(employees);
      })
      .catch((err) => res.send(err));
  }

  static createPage(req, res) {
    res.render("patients/createPage.ejs");
  }

  static create(req, res) {
    PatientModel.create(req.body)
      .then((result) => {
        res.redirect("/patients");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }

  static delete(req, res) {
    const id = Number(req.params.id);
    PatientModel.delete(id)
      .then((result) => {
        // res.send(result);
        res.redirect("/patients");
      })
      .catch((err) => res.send(err));
  }

  static updatePage(req, res) {
    const id = Number(req.params.id);
    PatientModel.getPatientById(id)
      .then((data) => {
        let patient = data[0];
        // console.log(employee);
        res.render("patients/updatePage.ejs", { patient });
      })
      .catch((err) => res.send(err));
  }

  static update(req, res) {
    const id = Number(req.params.id);
    PatientModel.update(id, req.body)
      .then((result) => {
        res.redirect("/patients");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }
}

module.exports = PatientController;
