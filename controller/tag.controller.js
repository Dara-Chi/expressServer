const Tag = require("../models/tag.model.js");

// Create and Save a new tag
exports.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Tag
  const tag = new Tag({

    g_name: req.body.t_name,
  });

  // Save Tag in the database
  Tag.create(tag, (err, data) => {
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
    Tag.getAll((err, data) => {
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
  
    Tag.findById(req.params.g_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Customer with id ${req.params.g_Id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Customer with id " + req.params.g_Id
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

  Tag.updateById(
    req.params.g_id,
    new Task(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found group/tag with id ${req.params.g_Id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating group/tag with id " + req.params.g_Id
          });
        }
      } else res.json(data);
    }
  );
  
};

