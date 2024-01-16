const { EmployerModel } = require("../model");

class EmployerController {
  static getEmployers(req, res) {
    EmployerModel.getEmployers()
      .then((employers) => {
        res.render("employers/index.ejs", { employers });
        // res.send(employers);
      })
      .catch((err) => res.send(err));
  }

  static createPage(req, res) {
    res.render("employers/createPage.ejs");
  }

  static create(req, res) {
    // console.log(req.body);
    EmployerModel.create(req.body)
      .then((result) => {
        res.redirect("/employers");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }

  static delete(req, res) {
    const id = Number(req.params.id);
    EmployerModel.delete(id)
      .then((result) => {
        // res.send(result);
        res.redirect("/employers");
      })
      .catch((err) => res.send(err));
  }

  static updatePage(req, res) {
    const id = Number(req.params.id);
    EmployerModel.getEmployerById(id)
      .then((data) => {
        let employer = data[0];
        // console.log(employer);
        res.render("employers/updatePage.ejs", { employer });
      })
      .catch((err) => res.send(err));
  }

  static update(req, res) {
    const id = Number(req.params.id);
    EmployerModel.update(id, req.body)
      .then((result) => {
        res.redirect("/employers");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }
}

module.exports = EmployerController;
