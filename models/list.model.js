const sql = require("./db.js");

const List = function(list){
    this.c_id = list.c_id;
    this.c_name = list.c_name;
}

List.create = (newList, result) => {
  sql.query("INSERT INTO Category SET ?", newList, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new list/category: ", { id: res.insertId, ...newList });
    result(null, { id: res.insertId, ...newList });
  });
};
//give a single date object to find the list of tasks that are on same date.
List.getdefault = (theday, result) => {
  
  sql.query('select task.t_name,task.t_due_date,priority.p_priority from task INNER JOIN priority ON task.t_priority = priority.p_id where t_due_date = ? ORDER BY task.t_priority',[theday], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tasks: ", res);
    result(null, res);
  });
};

// List.getOngoingTask = (theday, result) => {
//   //var theday = "2020-04-28 00:00:00";
//   sql.query('select task.t_name,task.t_due_date,priority.p_priority from task INNER JOIN priority ON task.t_priority = priority.p_id where t_status = 1 AND t_due_date = ? ORDER BY task.t_priority',[theday], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tasks: ", res);
//     result(null, res);
//   });
// };

// List.gettoStart = (theday, result) => {
//   //var theday = "2020-04-28 00:00:00";
//   sql.query('select task.t_name,task.t_due_date,priority.p_priority from task INNER JOIN priority ON task.t_priority = priority.p_id where t_status = 2 AND t_due_date = ? ORDER BY task.t_priority',[theday], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tasks: ", res);
//     result(null, res);
//   });
// };

// List.getDone = (theday, result) => {
//   //var theday = "2020-04-28 00:00:00";
//   sql.query('select task.t_name,task.t_due_date,priority.p_priority from task INNER JOIN priority ON task.t_priority = priority.p_id where t_status = 2 AND t_due_date = ? ORDER BY task.t_priority',[theday], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tasks: ", res);
//     result(null, res);
//   });
// };

// List.getOverdue = (theday, result) => {
//   //var theday = "2020-04-28 00:00:00";
//   sql.query('select task.t_name,task.t_due_date,priority.p_priority from task INNER JOIN priority ON task.t_priority = priority.p_id where t_status = 2 AND t_due_date = ? ORDER BY task.t_priority',[theday], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tasks: ", res);
//     result(null, res);
//   });
// };

List.getAll = result => {
    sql.query("SELECT * FROM CATEGORY", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("lists: ", res);
      result(null, res);
    });
  };
  
  List.updateById = (id, list, result) => {
    sql.query(
      "UPDATE category SET c_name = ? WHERE c_id = ?",
      [list.c_name,list.c_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found list with the id
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("updated list: ", { ...list });
        result(null, { ...list });
      }
    );
  };

  List.findById = (c_id, result) => {
    sql.query(`SELECT * FROM CATEGORY WHERE c_id = ${c_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      // if result row is not 0;
      if (res.length) {
        console.log("found list: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Task with the id
      result({ kind: "not_found" }, null);
    });
  };

  List.remove = (id, result) => {
    sql.query("DELETE FROM CATEGORY WHERE id = ?", id, (err, res) => {
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
  
      console.log("deleted list with id: ", id);
      result(null, res);
    });
  };


  

  module.exports = List; 