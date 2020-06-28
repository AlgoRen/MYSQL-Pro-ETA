var inquirer = require("inquirer");
var employee = require("./models/employee");

start();
function start() {
    inquirer
      .prompt({
        name: "calltoAction",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", 
        "View All Employees by Department", 
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Manager",
        "Add Department",
        "Add Roles",
        "Remove Roles",
        "Remove Departments",
        "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.calltoAction === "View All Employees") {
            //   postAuction(); Figure out what should be called here.
            employee.all(function(data) {
                var hbsObject = {
                employees: data
                };
                console.log(hbsObject);
            });
        }
        else if(answer.calltoAction === "View All Employees by Department") {
            //
        } else{
          connection.end();
        }
      });
  }