
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
  
  Task.findById = (t_id, result) => {
    sql.query(`SELECT * FROM Task WHERE t_id = ${t_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      // if result row is not 0;
      if (res.length) {
        console.log("found task: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Task with the id
      result({ kind: "not_found" }, null);
    });
  };

  Task.create = (newTask, result) => {
    sql.query("INSERT INTO Task SET ?", newTask, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created task: ", { id: res.insertId, ...newTask });
      result(null, { id: res.insertId, ...newCustomer });
    });
  };
  
  Task.updateById = (id, task, result) => {
    sql.query(
      "UPDATE Task SET t_name = ?, t_user = ?, t_priority = ?, t_status = ?, t_description = ?, t_start_date =?,  t_due_date = ?, t_group=?, t_caregory=?, WHERE id = ? AND t_active = 1",
      [task.t_name, task.t_user, task.t_priority, task.t-status, task.t_description,task.t_start_date,task.t_due_date,task.t_group,task.t_caregory,task.t_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated TASK: ", { id: id, ...task });
        result(null, { id: id, ...task });
      }
    );
  };
 
  Task.remove = (id, result) => {
    sql.query("UPDATE Task SET t_active=0, WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("DELETED TASK: ", { id: id, ...task });
      result(null, { id: id, ...task });
    });
  };
  

  module.exports = Task;