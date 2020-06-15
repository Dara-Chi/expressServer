module.exports = app => {
    const tasks = require("../controller/task.controller.js");
  
    app.post('/CreateTask', tasks.create);
    // Retrieve all tasks
    app.get("/tasks", tasks.findAll);
    // Update a task with taskId
    app.put("/tasks/:t_id", tasks.update);
    // update a task to be inactive
    app.put("/deleteTasks/:t_id", tasks.remove);
    //send out a list of tasks to nominated email
    app.post("/sendList/", tasks.sendList);
    //get a list of tasks has similar name;
    app.put("/tasks/SearchName/:t_name", tasks.searchByName);

    app.get('/OverDue', tasks.findOverdue);

 };