const Task = require("../models/task.model.js");
const TaskCreation = require("../models/taskcreation.model.js");

//set create task controller a set of functions in sequence
exports.create = [validateTaskCreationEntry, createTaskCreationEntry, createTaskEntries];

// validate request
function validateTaskCreationEntry (req, res, next) {
  if (req.body) return next();
  res.status(400).send('Content can not be empty!');
}

// create task creation entry in the db
function createTaskCreationEntry (req, res, next) {
  const taskCreation =new TaskCreation({
    tc_recurring:req.body.tc_recurring,
    tc_frequency:req.body.tc_frequency,
    tc_times:req.body.tc_times,
    tc_start_date:req.body.t_start_date    
  });

  console.log('creating task creation');
  TaskCreation.create(taskCreation, (err, data) => {
    if (err) {
      console.error('creation of task creation failed', err);
      return res.status(500).send("Some error occurred while creating the task.");
    }
    res.locals.taskCreation = data;
    console.log('task creation:', data);
    next();
  });
}
//create task in the db after task_creation table entry complete and return result. 
function createTaskEntries (req, res, next) {
  const taskCreation = res.locals.taskCreation;

  const taskTemplate = new Task({
    t_name: req.body.t_name,
    t_priority: req.body.t_priority,
    t_status: req.body.t_status,
    t_description: req.body.t_description,
    t_start_date: req.body.t_start_date,
    t_due_date: req.body.t_due_date,
    t_group: req.body.t_group,
    t_category: req.body.t_category,
    t_rec_id: taskCreation.t_rec_id
  });

  console.log('creating tasks', taskCreation);
  Task.create(taskTemplate, taskCreation, (err, data) => {
    if (err) {
      console.error('creation of tasks failed', err);
      return res.status(500).send("An error occurred while creating the tasks.");
    }
    console.log('task data:', data);
    res.json(data);
   
  });
}

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

