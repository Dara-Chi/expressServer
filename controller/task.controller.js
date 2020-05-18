const Task = require("../models/task.model.js");

// Create and Save a new task
exports.create = (req, res) => {

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
  
};

// Update a task identified by the customerId in the request
exports.update = (req, res) => {
  
};

// Delete a task with the specified customerId in the request
exports.delete = (req, res) => {
  
};

// Delete all tasks from the database.
exports.deleteAll = (req, res) => {
  
};