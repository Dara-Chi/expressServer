const sql = require("./db.js");

const Reminder = function(reminder){
    this.reminder_status = reminder.reminder_status;
    this.reminder_date = reminder.reminder_date;
}


Reminder.checkReminderStatus = (reminder_date, result) =>{
    sql.query(`SELECT * FROM reminder WHERE reminder_due_date = ${reminder_date}`, (err, res) => {
        if(err){
            console.log('err: ',err);
            result(err, null);
            return;
        }
        if(!res.length){
            console.log('no reminder has been sent on the day.');
            result({kind: "not_found"}, null);
            return;
        }
        result(null, res);
    })
} 

Reminder.getReminderTasks = (reminder_date, result) =>{
    sql.query(`SELECT t_name, t_priority, t_status FROM task WHERE t_due_date = ${t_due_date} AND t_active =1 ORDER BY t_status, t_priority`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        sql.query(`SELECT * WHERE reminder_date = ${reminder_date}`, (err, res) => {
          if(err){
            console.log("error: ", err);
            result(null, err);
            return;
          }
          if(res.length){
            var inserRes = InsertReminderTable();
            console.log(inserRes);
          }
        });
        console.log("tasks: ", res);
        result(null, res);
      });
}
//insert a new entry to reminder table to  show the reminder has been sent on the date 
Reminder.create = (newReminder, result) => {
  sql.query("INSERT INTO reminder SET ?", newReminder, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new reminder: ", { reminder_id: res.insertId, ...newRemder });
    result(null, { reminder_id: res.insertId, ...newRemder });
  });
};

