module.exports = app => {

  const lists = require("../controller/list.controller.js");

  // Create a new list
  app.post("/createList", lists.create);

  // // Retrieve all tasks
  // app.get("/tasksall", lists.findDefault);

  // // Retrieve all tasks
  // app.get("/tasksongoing", lists.findOngoingTask);

  // // Retrieve all tasks to start 
  // app.get("/taskstostart", lists.findtoStart);

  // // Retrieve all tasks done
  // app.get("/tasksdone", lists.findDone);

  // // Retrieve all tasks over due
  // app.get("/tasksoverdue", lists.findOverdue);

  // Retrieve all list
  app.get("/lists", lists.findAll);

  // Retrieve a single list with listId
  app.get("/lists/:listId", lists.findOne);

  // Update a list with listId
  app.put("/updateList/:listId", lists.update);

};