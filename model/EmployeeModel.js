const fs = require("fs");
const { resolve } = require("path");

class EmployeeModel {
  constructor(id, name, job, age, city) {
    this.id = id;
    this.name = name;
    this.job = job;
    this.age = age;
    this.city = city;
  }

  static getEmployees() {
    return new Promise((resolve, reject) => {
      fs.readFile("./employees.json", "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          let employees = JSON.parse(data);
          employees = employees.map((employee) => {
            const { id, name, job, age, city } = employee;
            return new EmployeeModel(id, name, job, age, city);
          });
          resolve(employees);
        }
      });
    });
  }

  static getEmployeeById(id) {
    return new Promise((resolve, reject) => {
      this.getEmployees()
        .then((employees) => {
          employees = employees.filter((employee) => employee.id === id);
          if (employees.length === 0) {
            resolve({
              message: `Employee ID ${id} not found.`,
            });
          } else {
            resolve(employees);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(body) {
    return new Promise((resolve, reject) => {
      this.getEmployees()
        .then((data) => {
          let employees = data;
          let id;
          if (employees.length === 0) {
            id = 1;
          } else {
            id = employees[employees.length - 1].id + 1;
          }
          let { name, job, age, city } = body;

          employees.push(new EmployeeModel(id, name, job, +age, city));

          this.save(employees);
          resolve(new EmployeeModel(id, name, job, +age, city));
        })
        .catch((err) => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      this.getEmployees()
        .then((data) => {
          let employees = data;

          let employeesFiltered = employees.filter(
            (employee) => employee.id !== id
          );

          if (employeesFiltered.length === employees.length) {
            resolve(`Employee ID ${id} not deleted`);
          } else {
            this.save(employeesFiltered);
            resolve(`Employee ID ${id} has been deleted`);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static update(id, body) {
    return new Promise((resolve, reject) => {
      this.getEmployees()
        .then((data) => {
          let employees = data;
          const { name, job, age, city } = body;

          employees = employees.map((employee) => {
            if (employee.id === id) {
              employee.name = name;
              employee.job = job;
              employee.age = +age;
              employee.city = city;
            }
            return employee;
          });
          this.save(employees);
          resolve({ message: `Data ID ${id} has been updated` });
        })
        .catch((err) => reject(err));
    });
  }

  static save(employees) {
    const employeeString = JSON.stringify(employees, null, 2);
    fs.writeFileSync("./employees.json", employeeString);
  }
}

module.exports = EmployeeModel;
