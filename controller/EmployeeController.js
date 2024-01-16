const { EmployeeModel } = require("../model");

class EmployeeController {
  static getEmployees(req, res) {
    EmployeeModel.getEmployees()
      .then((employees) => {
        res.render("employees/index.ejs", { employees });
        // res.send(employees);
      })
      .catch((err) => res.send(err));
  }

  static createPage(req, res) {
    res.render("employees/createPage.ejs");
  }

  static create(req, res) {
    EmployeeModel.create(req.body)
      .then((result) => {
        res.redirect("/employees");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }

  static delete(req, res) {
    const id = Number(req.params.id);
    EmployeeModel.delete(id)
      .then((result) => {
        // res.send(result);
        res.redirect("/employees");
      })
      .catch((err) => res.send(err));
  }

  static updatePage(req, res) {
    const id = Number(req.params.id);
    EmployeeModel.getEmployeeById(id)
      .then((data) => {
        let employee = data[0];
        // console.log(employee);
        res.render("employees/updatePage.ejs", { employee });
      })
      .catch((err) => res.send(err));
  }

  static update(req, res) {
    const id = Number(req.params.id);
    EmployeeModel.update(id, req.body)
      .then((result) => {
        res.redirect("/employees");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }
}

module.exports = EmployeeController;
