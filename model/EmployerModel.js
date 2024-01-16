const fs = require("fs");
const { resolve } = require("path");

class EmployerModel {
  constructor(id, name, type, total_employee, city) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.total_employee = total_employee;
    this.city = city;
  }

  static getEmployers() {
    return new Promise((resolve, reject) => {
      fs.readFile("./employers.json", "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          let employers = JSON.parse(data);
          employers = employers.map((employer) => {
            const { id, name, type, total_employee, city } = employer;
            return new EmployerModel(id, name, type, total_employee, city);
          });
          resolve(employers);
        }
      });
    });
  }

  static getEmployerById(id) {
    return new Promise((resolve, reject) => {
      this.getEmployers()
        .then((employers) => {
          employers = employers.filter((employer) => employer.id === id);
          if (employers.length === 0) {
            resolve({
              message: `Employer ID ${id} not found.`,
            });
          } else {
            resolve(employers);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(body) {
    return new Promise((resolve, reject) => {
      this.getEmployers()
        .then((data) => {
          let employers = data;
          let id;
          if (employers.length === 0) {
            id = 1;
          } else {
            id = employers[employers.length - 1].id + 1;
          }
          let { name, type, total_employee, city } = body;

          employers.push(
            new EmployerModel(id, name, type, +total_employee, city)
          );

          this.save(employers);
          resolve(new EmployerModel(id, name, type, +total_employee, city));
        })
        .catch((err) => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      this.getEmployers()
        .then((data) => {
          let employers = data;

          let employersFiltered = employers.filter(
            (employee) => employee.id !== id
          );

          if (employersFiltered.length === employers.length) {
            resolve({
              message: `employer ID ${id} not deleted.`,
            });
          } else {
            console.log(employersFiltered);
            this.save(employersFiltered);
            resolve({
              message: `employer ID ${id} has been deleted.`,
            });
          }
        })
        .catch((err) => reject(err));
    });
  }

  static update(id, body) {
    return new Promise((resolve, reject) => {
      this.getEmployers()
        .then((data) => {
          let employers = data;
          const { name, type, total_employee, city } = body;

          employers = employers.map((employer) => {
            if (employer.id === id) {
              employer.name = name;
              employer.type = type;
              employer.total_employee = +total_employee;
              employer.city = city;
            }
            return employer;
          });
          this.save(employers);
          resolve({ message: `Employer ID ${id} has been updated` });
        })
        .catch((err) => reject(err));
    });
  }

  static save(employers) {
    const employerString = JSON.stringify(employers, null, 2);
    fs.writeFileSync("./employers.json", employerString);
  }
}

module.exports = EmployerModel;
