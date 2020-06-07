const sql = require("./db.js");
var add = require('date-fns/add');
var format = require('date-fns/format');

// constructor
const TaskCreation = function(taskCreation){
    this.tc_recurring=taskCreation.tc_recurring;
    this.tc_frequency=taskCreation.tc_frequency;
    this.tc_times=taskCreation.tc_times;
    this.tc_start_date=taskCreation.tc_start_date;
}

TaskCreation.create = (newTaskCreation, result) => {
    sql.query("INSERT INTO task_creation SET ?", newTaskCreation, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new task_creation entry: ", { tc_id: res.insertId, ...newTaskCreation });
      result(null, { tc_id: res.insertId, ...newTaskCreation });
    });
  };

  module.exports = TaskCreation;