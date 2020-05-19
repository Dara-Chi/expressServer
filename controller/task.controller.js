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

    name: req.body.name,
    priority: req.body.priority,
    status: req.body.status,
    description: req.body.description,
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
    group: req.body.group,
    category: req.body.category,
    recurring: req.body.recurring,
    frequency: req.body.frequency,
    times: req.body.times
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
            message: `Not found Customer with id ${req.params.t_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.t_id
          });
        }
      } else res.json(data);
    }
  );
  
};

