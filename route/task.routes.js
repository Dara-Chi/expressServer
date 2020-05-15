module.exports = app => {
    const tasks = require("../controller/task.controller.js");
  
    // Create a new Customer
    app.post("/tasks", tasks.create);
  
    // Retrieve all Customers
    app.get("/tasks", tasks.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/tasks/:taskId", tasks.findOne);
  
    // Update a Customer with customerId
    app.put("/tasks/:taskId", tasks.update);
  
    // Delete a Customer with customerId
    app.delete("/tasks/:taskId", tasks.delete);
  
    // Create a new Customer
    app.delete("/tasks", tasks.deleteAll);
  };