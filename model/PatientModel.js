const fs = require("fs");
const { resolve } = require("path");

class PatientModel {
  constructor(patientId, patientName, service, clinic, visitDate, birthDate, rooms) {
    this.patientId = patientId;
    this.patientName = patientName;
    this.service = service;
    this.clinic = clinic;
    this.visitDate = visitDate;
    this.birthDate = birthDate;
    this.rooms = rooms;
  }

  static getPatients() {
    return new Promise((resolve, reject) => {
      fs.readFile("./patients.json", "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          let patients = JSON.parse(data);
          patients = patients.map((patient) => {
            const { patientId, patientName, service, clinic, visitDate, birthDate, rooms } = patient;
            return new PatientModel(patientId, patientName, service, clinic, visitDate, birthDate, rooms);
          });
          resolve(patients);
        }
      });
    });
  }

  static getPatientById(id) {
    return new Promise((resolve, reject) => {
      this.getPatients()
        .then((patients) => {
          patients = patients.filter((patient) => patient.patientId === id);
          if (patients.length === 0) {
            resolve({
              message: `Patient ID ${id} not found.`,
            });
          } else {
            resolve(patients);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(body) {
    return new Promise((resolve, reject) => {
      this.getPatients()
        .then((data) => {
          let patients = data;
          let patientId;
          if (patients.length === 0) {
            patientId = 1;
          } else {
            patientId = patients[patients.length - 1].patientId + 1;
          }
          let { patientName, service, clinic, visitDate, birthDate, rooms } = body;

          patients.push(new PatientModel(patientId, patientName, service, clinic, visitDate, birthDate, rooms));

          this.save(patients);
          resolve(new PatientModel(patientId, patientName, service, clinic, visitDate, birthDate, rooms));
        })
        .catch((err) => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      this.getPatients()
        .then((data) => {
          let patients = data;

          let patientsFiltered = patients.filter(
            (patient) => patient.id !== id
          );

          if (patientsFiltered.length === patients.length) {
            resolve(`Patient ID ${id} not deleted`);
          } else {
            this.save(patientsFiltered);
            resolve(`Patient ID ${id} has been deleted`);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static update(id, body) {
    return new Promise((resolve, reject) => {
      this.getPatients()
        .then((data) => {
          let patients = data;
          const { patientName, service, clinic, visitDate, birthDate, rooms } = body;

          patients = patients.map((patient) => {
            if (patient.patientId === id) {
              patient.patientName = patientName;
              patient.service = service;
              patient.clinic = clinic;
              patient.visitDate = visitDate;
              patient.birthDate = birthDate;
            }
            return patient;
          });
          this.save(patients);
          resolve({ message: `Data ID ${id} has been updated` });
        })
        .catch((err) => reject(err));
    });
  }

  static save(patients) {
    const patientString = JSON.stringify(patients, null, 2);
    fs.writeFileSync("./patients.json", patientString);
  }
}

module.exports = PatientModel;
