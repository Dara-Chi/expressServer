const List = require("../models/list.model.js");

// Create and Save a new list
exports.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Tag
  const list = new List({

    c_name: req.body.c_name,
  });

  // Save Customer in the database
  List.create(list, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the task."
      });
    else res.json(data);
  });

};

// Retrieve all tags from the database.
exports.findAll = (req, res) => {
    List.getAll((err, data) => {
        if (err) {
            const message = err.message || "Some error occurred while retrieving customers.";
            res.status(500).json({ message });
        } else {
            res.json(data);
        }
    });
};

// Find a single tags with a tag id/g_id
exports.findOne = (req, res) => {
  
    List.findById(req.params.c_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Customer with id ${req.params.c_Id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Customer with id " + req.params.c_Id
            });
          }
        } else res.json(data);
      });
};

// Update a tags identified by the tag id/g_id in the request
exports.update = (req, res) => {
    // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Task.updateById(
    req.params.c_id,
    new Task(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found group/tag with id ${req.params.c_Id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating group/tag with id " + req.params.c_Id
          });
        }
      } else res.json(data);
    }
  );
  
};

