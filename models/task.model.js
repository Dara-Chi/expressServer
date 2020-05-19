
const sql = require("./db.js");

// constructor
const Task = function (task) {
  this.id = task.id;
  this.name = task.name;
  this.priority = task.priority;
  this.status = task.status;
  this.description = task.description;
  this.startDate = task.startDate;
  this.dueDate = task.dueDate;
  this.recId = task.recId;
  this.group = task.group;
  this.category = task.category;
  this.recurring = task.recurring;
  this.frequency = task.frequency;
  this.times = task.times;
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
    if (newTask.recurring) {
  
      var valueListCrt = [newTask.recurring, newTask.frequency, newTask.times, newTask.startDate];
      var sqlCrt = "INSERT INTO task_creation (tc_recurring, tc_frequency, tc_times, tc_start_date) VALUES (?)";
  
      //console.log(valueListCrt);
      //run query to insert values into task table
      sql.query(sqlCrt, [valueListCrt], function (err, res) {
        if (err) {
          console.log("[mysql error]", err);
          result(err, null);
          return;
        } else {
          global.newId = res.insertId;
  
          //console.log("Result: " + result);
  
          for (var i = 0; i < newTask.times; i++) {
            var sDate = new Date(newTask.startDate);
            var dDate = new Date(newTask.dueDate);
            var recDates = [];
            var sqlTsk = "INSERT INTO task (t_name, t_user, t_priority, t_status, t_description, t_start_date, t_due_date, t_rec_id, t_group, t_caregory, t_active) VALUES (?)";
  
            if (i > 0) {
  
              recDates = getRecDate(newTask.frequency, sDate, dDate, i);
              sDate = recDates[0];
              dDate = recDates[1];
  
            }
  
            valueListTsk = [newTask.name, 1, newTask.priority, newTask.status, newTask.description, sDate, dDate, global.newId, newTask.group, newTask.category, 1];
  
            //console.log(valueListTsk);
            //run query to insert values into task table
            sql.query(sqlTsk, [valueListTsk], function (err, res) {
              if (err) {
                console.log("[mysql error]", err);
                result(err, null);
                return;
              }
              message = "New task has been added!";
              //console.log("Result: " + result);
              //Note: send message to front-end during integration
              console.log(message);
              //result(null, { id: res.insertId, ...newTask });
  
            });
          }
  
          result(null, "Task added!");
  
        }
  
      });
    }
    else {
      valueListTsk = [newTask.name, 1, newTask.priority, newTask.status, newTask.description, newTask.startDate, newTask.dueDate, null, newTask.group, newTask.category, 1];
  
      var sqlTsk = "INSERT INTO task (t_name, t_user, t_priority, t_status, t_description, t_start_date, t_due_date, t_rec_id, t_group, t_caregory, t_active) VALUES (?)";
      //console.log(valueListTsk);
      //run query to insert values into task table
      sql.query(sqlTsk, [valueListTsk], function (err, res) {
        if (err) {
          console.log("[mysql error]", err);
          result(err, null);
          return;
        }
        message = "New task has been added!";
        //console.log("Result: " + result);
        //Note: send message to front-end during integration
        console.log(message);
        result(null, { id: res.insertId, ...newTask });
  
      });
    }
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
        // not found task with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("DELETED TASK: ", { id: id, ...task });
      result(null, { id: id, ...task });
    });
  };
  

  /**
* 
* @param {String} freq 
* @param {datetime} sdate 
* @param {datetime} ddate 
* @param {int} no 
*/
function getRecDate(freq, sdate, ddate, no) {
  var dateArr = [];

  switch (freq) {
    case "daily":
      sdate = add(sdate, {
        days: no,
      });
      ddate = add(ddate, {
        days: no,
      });
      break;
    case "weekly":
      sdate = add(sdate, {
        weeks: no,
      });
      ddate = add(ddate, {
        weeks: no,
      });
      break;
    case "monthly":
      sdate = add(sdate, {
        months: no,
      });
      ddate = add(ddate, {
        months: no,
      });
      break;
    case "fortnightly":
      sdate = add(sdate, {
        weeks: (no * 2),
      });
      ddate = add(ddate, {
        weeks: (no * 2),
      });
      break;
  }

  dateArr[0] = sdate;
  dateArr[1] = ddate;

  return dateArr;
}

module.exports = Task;
  module.exports = Task;