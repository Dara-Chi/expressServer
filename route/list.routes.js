module.exports = app => {

  const lists = require("../controller/list.controller.js");

  // Create a new list
  app.post("/lists", lists.create);

  // Retrieve all Customers
  app.get("/tasksall", lists.findDefault);

  // Retrieve all Customers
  app.get("/tasksongoing", lists.findOngoingTask);

  // Retrieve all Customers
  app.get("/taskstostart", lists.findtoStart);

  // Retrieve all Customers
  app.get("/tasksdone", lists.findDone);

  // Retrieve all Customers
  app.get("/tasksoverdue", lists.findOverdue);

  // Retrieve all list
  app.get("/lists", lists.findAll);

  // Retrieve a single list with listId
  app.get("/lists/:listId", lists.findOne);

  // Update a list with listId
  app.put("/lists/:listId", lists.update);

};