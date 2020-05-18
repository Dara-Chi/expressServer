const sql = require("./db.js");

const List = function(list){

    this.c_id = list.c_id;
    this,c_name = list.c_name;
}

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
  
  List.findById = (t_id, result) => {
    sql.query(`SELECT * FROM CATEGORY WHERE c_id = ${c_id}`, (err, res) => {
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