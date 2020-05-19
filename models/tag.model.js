const sql = require("./db.js");

const Tag = function(tag){
    this.g_name = tag.g_name;
}


Tag.create = (newTag, result) => {
  sql.query("INSERT INTO Groupe SET ?", newTag, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new tag/group: ", { id: res.insertId, ...newTag });
    result(null, { id: res.insertId, ...newTag });
  });
};


Tag.getAll = result => {
    sql.query("SELECT * FROM GROUPE", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("lists: ", res);
      result(null, res);
    });
  };
  
  Tag.findById = (t_id, result) => {
    sql.query(`SELECT * FROM GROUPE WHERE c_id = ${c_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      // if result row is not 0;
      if (res.length) {
        console.log("found TAG: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found tag with the id
      result({ kind: "not_found" }, null);
    });
  };

  Tag.remove = (id, result) => {
    sql.query("DELETE FROM GROUPE WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found tag with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted TAG with id: ", id);
      result(null, res);
    });
  };

  module.exports = Tag; 