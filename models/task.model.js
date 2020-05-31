const sql = require("./db.js");
var add = require('date-fns/add');
var format = require('date-fns/format');

// constructor
const Task = function (task) {
  this.t_id= task.t_id;
  this.t_name = task.t_name;
  this.t_priority = task.t_priority;
  this.t_status = task.t_status;
  this.t_description = task.t_description;
  this.t_start_date = task.t_start_date;
  this.t_due_date = task.t_due_date;
  this.t_rec_id = global.newId;
  this.t_group = task.t_group;
  this.t_category = task.t_category;
  this.tc_recurring = task.tc_recurring;
  this.tc_frequency = task.tc_frequency;
  this.tc_times = task.tc_times;
};
///should have separate model for task creation  
//

Task.getAll = result => {
    sql.query("SELECT * FROM Task WHERE t_active =1 ORDER BY task.t_priority", (err, res) => {
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
    console.log(newTask);
    if (newTask.tc_recurring) {
  
      var valueListCrt = [newTask.tc_recurring, newTask.tc_frequency, newTask.tc_times, newTask.t_start_date];
      var sqlCrt = "INSERT INTO task_creation (tc_recurring, tc_frequency, tc_times, tc_start_date) VALUES (?)";
  
      //console.log(valueListCrt);
      //run query to insert values into task table
      sql.query(sqlCrt, [valueListCrt], function (err, res) {
        if (err) {
          console.log("[mysql error]", err);
          result(err, null);
          return;
        } else {
          console.log('res:', res);
          const newId = res.insertId;
  
          console.log("rec id: " + newId);
  
          for (var i = 0; i < newTask.tc_times; i++) {
            var sDate = new Date(newTask.t_start_date);
            var dDate = new Date(newTask.t_due_date);
            var recDates = [];
            var sqlTsk = "INSERT INTO task (t_name, t_priority, t_status, t_description, t_start_date, t_due_date, t_rec_id, t_group, t_category, t_active) VALUES (?)";
  
            if (i > 0) {
              recDates = getRecDate(newTask.tc_frequency, sDate, dDate, i);
              sDate = recDates[0];
              dDate = recDates[1];
            }
  
            valueListTsk = [newTask.t_name, newTask.t_priority, newTask.t_status, newTask.t_description, sDate, dDate, newId, newTask.t_group, newTask.t_category, 1];

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
      valueListTsk = [newTask.t_name, newTask.t_priority, newTask.t_status, newTask.t_description, newTask.t_start_date, newTask.t_due_date, global.newId, newTask.t_group, newTask.t_category, 1];
  
      var sqlTsk = "INSERT INTO task (t_name, t_priority, t_status, t_description, t_start_date, t_due_date, t_rec_id, t_group, t_category, t_active) VALUES (?)";
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
      "UPDATE task SET t_name = ?, t_priority = ?, t_status = ?, t_description = ?, t_start_date = ?,  t_due_date = ?, t_group= ?, t_category= ? WHERE t_id = ? AND t_active = 1",
      [task.t_name, task.t_priority, task.t_status, task.t_description,task.t_start_date,task.t_due_date,task.t_group,task.t_category,task.t_id],
      (err, res) => {
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
        console.log("updated TASK: ", { id: id, ...task });
        result(null, { id: id, ...task });
      }
    );
  };
 
  Task.remove = (id, result) => {
    sql.query("UPDATE Task SET t_active=0 WHERE t_id = ?", id, (err, res) => {
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
      console.log("DELETED TASK: ", {id:id});
      
      
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
