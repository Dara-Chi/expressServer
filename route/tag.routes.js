module.exports = app => {
    const tags = require("../controller/tag.controller.js");
  
    // Create a new tag
    app.post("/CreateTag", tags.create);
  
    // Retrieve all tags
    app.get("/tags", tags.findAll);
  
    // Retrieve a single tag with taskId
    app.get("/tags/:tagId", tags.findOne);
  
    // Update a tag with taskId
    app.put("/UpdateTag/:g_id", tags.update);
  
    app.delete("/DeleteTag/:g_id", tags.remove);
  };