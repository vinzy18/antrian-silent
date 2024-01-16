const { JobModel } = require("../model");
const rpConvert = require("rupiah-format");

class JobController {
  static getJobs(req, res) {
    JobModel.getJobs()
      .then((jobs) => {
        jobs.map((job) => {
          job.max_salary = rpConvert.convert(job.max_salary);
          job.min_salary = rpConvert.convert(job.min_salary);
        });
        res.render("jobs/index.ejs", { jobs });
        // res.send(jobs);
      })
      .catch((err) => res.send(err));
  }

  static createPage(req, res) {
    res.render("jobs/createPage.ejs");
  }

  static create(req, res) {
    JobModel.create(req.body)
      .then((result) => {
        // res.send(result);
        res.redirect("/jobs");
      })
      .catch((err) => res.send(err));
  }

  static delete(req, res) {
    const id = Number(req.params.id);
    JobModel.delete(id)
      .then((result) => {
        // res.send(result);
        res.redirect("/jobs");
      })
      .catch((err) => res.send(err));
  }

  static updatePage(req, res) {
    const id = Number(req.params.id);
    JobModel.getJobById(id)
      .then((data) => {
        let job = data[0];
        // console.log(job);
        res.render("jobs/updatePage.ejs", { job });
      })
      .catch((err) => res.send(err));
  }

  static update(req, res) {
    const id = Number(req.params.id);
    JobModel.update(id, req.body)
      .then((result) => {
        res.redirect("/jobs");
        // res.send(result);
      })
      .catch((err) => res.send(err));
  }
}

module.exports = JobController;
