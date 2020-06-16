const Task = require("../models/task.model.js");
const TaskCreation = require("../models/taskcreation.model.js");
const nodemailer = require('nodemailer');
const cron = require("node-cron");



//set create task controller a set of functions in sequence
exports.create = [validateRequestEntry, createTaskCreationEntry, createTaskEntries];

// validate request
function validateRequestEntry (req, res, next) {
  if (req.body) return next();
  res.status(400).send('Content can not be empty!');
}

// create task creation entry in the db
function createTaskCreationEntry (req, res, next) {
  const taskCreation =new TaskCreation({
    tc_recurring:req.body.tc_recurring,
    tc_frequency:req.body.tc_frequency,
    tc_times:req.body.tc_times,
    tc_start_date:req.body.t_start_date    
  });

  console.log('creating task creation');
  TaskCreation.create(taskCreation, (err, data) => {
    if (err) {
      console.error('creation of task creation failed', err);
      return res.status(500).send("Some error occurred while creating the task.");
    }
    res.locals.taskCreation = data;
    console.log('task creation:', data);
    next();
  });
}
//create task in the db after task_creation table entry complete and return result. 
function createTaskEntries (req, res) {
  const taskCreation = res.locals.taskCreation;

  const taskTemplate = new Task({
    t_name: req.body.t_name,
    t_priority: req.body.t_priority,
    t_status: req.body.t_status,
    t_description: req.body.t_description,
    t_start_date: req.body.t_start_date,
    t_due_date: req.body.t_due_date,
    t_group: req.body.t_group,
    t_category: req.body.t_category,
    t_rec_id: taskCreation.t_rec_id
  });
  Task.create(taskTemplate, taskCreation, (err, data) => {
    if (err) {
      return res.status(500).send("An error occurred while creating the tasks.");
    }
    res.json(data);
  });
}

// Retrieve all tasks from the database.
exports.findAll = (req, res) => {
    Task.getAll((err, data) => {
        if (err) {
            const message = err.message || "Some error occurred while retrieving tasks.";
            res.status(500).json({ message });
        } else {
            res.json(data);
        }
    });
};

exports.findOverdue = (req, res)=>{
  Task.getOverdue((err, data)=>{
    if (err) {
      const message = err.message || "Some error occurred while retrieving tasks.";
      res.status(500).json({ message });
    } else {
      res.json(data);
    }
  });
}

// Find a single task with a name
exports.searchByName = (req, res) => {
  Task.searchByName(req.params.t_name, (err, data) => {
    if (err) {
        const message = err.message || "Some error occurred while retrieving customers.";
        res.status(500).json({ message });
    } else {
        res.json(data);
    }
  });
};

// Update a task identified by the task id in the request
exports.update = (req, res) => {
    // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Task.updateById(
    req.params.t_id,
    new Task(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found task with id ${req.params.t_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating task with id " + req.params.t_id
          });
        }
      } else res.json(data);
    }
  );
  
};

exports.remove = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Task.remove(
    req.params.t_id,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found task with id ${req.params.t_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error deleting task with id " + req.params.t_id
          });
        }
      } else res.json(data);
    }
  );
};
//set a sequnce of action when sending out list of task
exports.sendList = [validateRequestEntry, getListTasks];

function getListTasks(req, res){
  Task.findByList(req.body.t_category,(err, data)=> {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found list id ${req.body.t_category}.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving tasks with list id:  ${req.body.t_category}.`
        });
      }
    } else {
      var body = createBody(data);
      sendEmail(body, req.body);
      res.json(data);
    }
  });
}
/**
 * 
 * @param {array} res - result from task table
 * @param {string} name - recipient name
 */
function createBody(res){
  var txt = "Hi There,"+  "\n Here is your list of tasks!\n";    
  for(var i = 0; i < res.length; i++){
      txt = txt + "\n" + (i+1) + ". "+ res[i].t_name + "\n";
  }
  return txt; 
}

/**
 * Function to send an email
 * 
 * @param {string} body
 * @param {User.Email} recipient
 * @author Shehan Thelis
 * 
 */
function sendEmail(body, reqBody){
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'finishittodolist@gmail.com',
        pass: 'arptodolist'
      }
    });
    
    var mailOptions = {
      from: 'finishittodolist@gmail.com',
      to: reqBody.email,
      subject: reqBody.subject,
      text: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: '+ info.response);
        }
      }); 
}

//update database task status to overdue if due date is passed

cron.schedule("* 1 * * *", function(){
  Task.updateStatus ((err,res) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found`
        });
      } else {
        res.status(500).send({
          message: `Error updating status.`
        });
      }
    } 
  });
});
  


// scheduling sending out email reminder at 9 am everyday
cron.schedule(" * 9 * * *", function(){
  Task.GetTasksByDueDate((err,res)=>{
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving tasks.`
        });
      }
    } 
    var body = createBody(res);
    sendReminder(body);
  });
});

function sendReminder(body){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'finishittodolist@gmail.com',
      pass: 'arptodolist'
    }
  });
  
  var mailOptions = {
    from: 'finishittodolist@gmail.com',
    to: 'dara1214@gmail.com',
    subject: "your daily due tasks",
    text: body
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: '+ info.response);
      }
    }); 
}