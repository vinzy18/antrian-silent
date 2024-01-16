const fs = require("fs");
const rpConvert = require("rupiah-format");

class JobModel {
  constructor(id, name, category, max_salary, min_salary) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.max_salary = max_salary;
    this.min_salary = min_salary;
  }

  static getJobs() {
    return new Promise((resolve, reject) => {
      fs.readFile("./jobs.json", "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          let jobs = JSON.parse(data);
          jobs = jobs.map((job) => {
            const { id, name, category, max_salary, min_salary } = job;
            return new JobModel(id, name, category, +max_salary, +min_salary);
          });
          resolve(jobs);
        }
      });
    });
  }

  static getJobById(id) {
    return new Promise((resolve, reject) => {
      this.getJobs()
        .then((jobs) => {
          jobs = jobs.filter((job) => job.id === id);
          if (jobs.length === 0) {
            resolve({
              message: `Job ID ${id} not found.`,
            });
          } else {
            resolve(jobs);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(body) {
    return new Promise((resolve, reject) => {
      this.getJobs()
        .then((data) => {
          let jobs = data;
          let id;
          if (jobs.length === 0) {
            id = 1;
          } else {
            id = jobs[jobs.length - 1].id + 1;
          }
          let { name, category, max_salary, min_salary } = body;

          jobs.push(new JobModel(id, name, category, +max_salary, +min_salary));

          this.save(jobs);
          resolve(new JobModel(id, name, category, +max_salary, +min_salary));
        })
        .catch((err) => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      this.getJobs()
        .then((data) => {
          let jobs = data;

          let jobsFiltered = jobs.filter((job) => job.id !== id);

          if (jobsFiltered.length === jobs.length) {
            resolve(`Job ID ${id} not deleted.`);
          } else {
            this.save(jobsFiltered);
            resolve(`Job ID ${id} has been deleted.`);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static update(id, body) {
    return new Promise((resolve, reject) => {
      this.getJobs()
        .then((data) => {
          let jobs = data;
          const { name, category, max_salary, min_salary } = body;

          jobs = jobs.map((job) => {
            if (job.id === id) {
              job.name = name;
              job.category = category;
              job.max_salary = rpConvert.convertBack(max_salary)
              job.min_salary = rpConvert.convertBack(min_salary);
            }
            return job;
          });
          this.save(jobs);
          resolve({ message: `Job ID ${id} has been updated` });
        })
        .catch((err) => reject(err));
    });
  }

  static save(jobs) {
    const jobString = JSON.stringify(jobs, null, 2);
    fs.writeFileSync("./jobs.json", jobString);
  }
}

module.exports = JobModel;
