module.exports = app => {
    const tasks = require("../controller/task.controller.js");
  
    // Create a new task
    app.post("/CreateTask", tasks.create);
  
    // Retrieve all tasks
    app.get("/tasks", tasks.findAll);
  
    // Retrieve a single task with taskId
    app.get("/tasks/:t_id", tasks.findOne);
  
    // Update a Customer with taskId
    app.put("/tasks/:t_id", tasks.update);
  
  };