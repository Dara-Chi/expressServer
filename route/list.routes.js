module.exports = app => {

  const lists = require("../controller/list.controller.js");

  // Create a new list
  app.post("/createList", lists.create);

  // Retrieve all list
  app.get("/lists", lists.findAll);

  // Retrieve a single list with listId
  app.get("/lists/:listId", lists.findOne);

  // Update a list with listId
  app.put("/updateList/:c_id", lists.update);

  app.delete("/deleteList/:c_id", lists.remove);

};