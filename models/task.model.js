const sql = require("./db.js");
const moment = require("moment");
var add = require('date-fns/add');
var addDays = require('date-fns/addDays');

// constructor
const Task = function (task) {
  this.t_name = task.t_name;
  this.t_priority = task.t_priority;
  this.t_status = task.t_status;
  this.t_description = task.t_description;
  this.t_start_date = task.t_start_date;
  this.t_due_date = task.t_due_date;
  this.t_group = task.t_group;
  this.t_category = task.t_category;
};
///should have separate model for task creation  

Task.getAll = result => {
    var today = new Date();
    var fifthDate = moment(addDays(new Date(today), 4)).format('YYYY-MM-DD');
    today = moment(today).format('YYYY-MM-DD');
   
    sql.query("SELECT * FROM Task WHERE t_active =1 AND t_due_date >= ? AND t_due_date <= ? ORDER BY task.t_priority", [today, fifthDate], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("tasks: ", res);
      result(null, res);
    });
};

Task.getOverdue = result => {
  sql.query("SELECT * FROM Task WHERE t_status = 4 AND t_active = 1 ORDER BY t_priority", (err, res)=>{
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("tasks: ", res);
    result(null, res);
  });
  
}

Task.GetTasksByDueDate = result => {
  var today = moment().format('YYYY-MM-DD');
  sql.query("SELECT * FROM Task WHERE t_active =1 AND t_due_date = ?", [today], (err, res)=>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // if result row is not 0;
    if (res.length) {
      console.log("found task: ", res);
      result(null, res);
      return;
    }
    console.log('reminder sent...');
    result(null,res);
  })
}

Task.searchByName = (t_name, result) => {
  var searchReg = "%"+t_name+"%";
  sql.query(`SELECT * FROM Task WHERE t_name LIKE ? AND t_active = 1`,searchReg, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // if result row is not 0;
    if (res.length) {
      console.log("found task: ", res);
      result(null, res);
      return;
    }
    // not found Task with the name
    result({ kind: "not_found" }, null);
  });
};

Task.create = (newTask, taskCreation, result) => {

  const times = taskCreation.tc_recurring ? taskCreation.tc_times : 1;
  const newTasks = [];
  const sDate = new Date(newTask.t_start_date);
  const dDate = new Date(newTask.t_due_date);
  console.log({ sDate, dDate });
  for (var i = 0; i < times; i++) {

    var sqlTsk = "INSERT INTO task (t_name, t_priority, t_status, t_description, t_start_date, t_due_date, t_rec_id, t_group, t_category, t_active) VALUES (?)";
    var recDates = getRecDate(taskCreation.tc_frequency, sDate, dDate, i);
    console.log('>>>', i, recDates);
    const sDateI = recDates[0];
    const dDateI = recDates[1];
    valueListTsk = [newTask.t_name, newTask.t_priority, newTask.t_status, newTask.t_description, sDateI, dDateI, taskCreation.tc_id, newTask.t_group, newTask.t_category, 1];
    console.log('>>', valueListTsk);
    //run query to insert values into task table
    sql.query(sqlTsk, [valueListTsk], function (err, res) {
      if (err) {
        console.log("[mysql error]", err);
        result(err);
        return;
      }
      message = "New task has been added!";
      console.log(message);
      newTasks.push({ ...newTask, t_id: res.insertId, t_rec_id: taskCreation.tc_id });

      if (newTasks.length === parseInt(taskCreation.tc_times)) {
        result(null, newTasks);
      }
    });
  }
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
    default:
      throw new Error('unknown interval: ' + freq);
  }

  dateArr[0] = sdate;
  dateArr[1] = ddate;

  return dateArr;
}

Task.updateById = (id, task, result) => {
  sql.query(
    "UPDATE task SET t_name = ?, t_priority = ?, t_status = ?, t_description = ?, t_start_date = ?,  t_due_date = ?, t_group= ?, t_category= ? WHERE t_id = ? AND t_active = 1",
    [task.t_name, task.t_priority, task.t_status, task.t_description,task.t_start_date,task.t_due_date,task.t_group,task.t_category,id],
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
      console.log("updated TASK: ", { t_id: id, ...task });
      result(null, { t_id: id, ...task });
    }
  );
};
//update task status by 1 am daily
Task.updateStatus = (result) =>{
  var today = moment().format('YYYY-MM-DD');
  console.log('today:', today);
 
  sql.query("UPDATE task SET t_status = 4 WHERE t_due_date < ? AND t_active = 1 ", [today], (err, res)=>{
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found task with the id
      result(err, res);
      return;
    }
    result(null,res);
    
  });
}

Task.remove = (id, result) => {
  sql.query("UPDATE Task SET t_active=0 WHERE t_id = ?", id, (err, res) => {
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

    console.log("deleted task with id: ", id);
    result(null, res);
      
  });
};


Task.findByList = (t_category, result) => {
  console.log('List:',t_category);
  sql.query("SELECT * FROM task WHERE t_category = ? ORDER BY t_priority", [t_category], (err, res) => {
    if(err){
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.length == 0) {
      // not found task with the id
      console.log('res: ', res);


      result({ kind: "not_found" }, null);
      return;
    }
    console.log("found tasks matched the list: ", res);
      result(null, res);
      return;
  });
}

module.exports = Task;
