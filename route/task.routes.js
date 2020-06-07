module.exports = app => {
    const tasks = require("../controller/task.controller.js");
  
    app.post('/CreateTask', tasks.create);
  
    // Retrieve all tasks
    app.get("/tasks", tasks.findAll);
  
    // Retrieve a single task with taskId
    app.get("/tasks/:t_id", tasks.findOne);
  
    // Update a task with taskId
    app.put("/tasks/:t_id", tasks.update);
    // update a task to be inactive
    app.put("/deleteTasks/:t_id", tasks.remove);

    
  };