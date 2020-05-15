
const sql = require("./db.js");

// constructor
const Task = function(task) {
  this.t_id = task.t_name;
  this.t_name = task.name;
  this.t_user = task.active;
  this.t_priority = task.t_priority;
  this.t_status = task.t_status;
  this.t_description = task.t_description;
  this.t_start_date = task.t_start_date;
  this.t_due_date = task.t_due_date;
  this.t_rec_id = task.t_rec_id;
  this.t_group =task.t_group;
  this.t_caregory = task.t_caregory;
  this.t_active = task.t_active;
};



Task.getAll = result => {
    sql.query("SELECT * FROM Task", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("tasks: ", res);
      result(null, res);
    });
  };
  

  module.exports = Task;