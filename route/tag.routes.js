module.exports = app => {
    const tags = require("../controller/tag.controller.js");
  
    // Create a new task
    app.post("/tags", tags.create);
  
    // Retrieve all tasks
    app.get("/tags", tags.findAll);
  
    // Retrieve a single task with taskId
    app.get("/tags/:tagId", tags.findOne);
  
    // Update a Customer with taskId
    app.put("/tags/:tagId", tags.update);
  
  };