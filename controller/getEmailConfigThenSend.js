const { createBody, sendEmail } = require("./task.controller");
function getEmailConfigThenSend(result) {
  const user = {
    name: 'Dara',
    email: 'dara1214@gmail.com'
  };
  var bodyTxt = createBody(result, user.name);
  sendEmail(bodyTxt, user.email);
}
