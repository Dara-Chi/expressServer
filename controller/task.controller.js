const Task = require("../models/task.model.js");

// Create and Save a new task
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Task
  const task = new Task({

    t_name: req.body.t_name,
    t_priority: req.body.t_priority,
    t_status: req.body.t_status,
    t_description: req.body.t_description,
    t_start_date: req.body.t_start_date,
    t_due_date: req.body.t_due_date,
    t_group: req.body.t_group,
    t_category: req.body.t_category,
    tc_recurring:req.body.tc_recurring,
    t_rec_id: req.body.t_rec_id,
    tc_frequency: req.body.tc_frequency,
    tc_times: req.body.tc_times
  });

  // Save Task in the database
  Task.create(task, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the task."
      });
    else res.json(data);
  });

};

// Retrieve all tasks from the database.
exports.findAll = (req, res) => {
    Task.getAll((err, data) => {
        if (err) {
            const message = err.message || "Some error occurred while retrieving customers.";
            res.status(500).json({ message });
        } else {
            res.json(data);
        }
    });
};

// Find a single task with a customerId
exports.findOne = (req, res) => {
  
    Task.findById(req.params.t_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Customer with id ${req.params.t_id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Customer with id " + req.params.t_id
            });
          }
        } else res.json(data);
      });
};

// Update a task identified by the task id in the request
exports.update = (req, res) => {
    // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Task.updateById(
    req.params.t_id,
    new Task(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found task with id ${req.params.t_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating task with id " + req.params.t_id
          });
        }
      } else res.json(data);
    }
  );
  
};


exports.remove = (req, res) => {
  // Validate Request
if (!req.body) {
  res.status(400).send({
    message: "Content can not be empty!"
  });
}

Task.remove(
  req.params.t_id,
  new Task(req.body),
  (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found task with id ${req.params.t_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error deleting task with id " + req.params.t_id
        });
      }
    } else res.json(data);
  }
);

};

