var inquirer = require("inquirer");
// Import MySQL connection.
var connection = require("./config/connection.js");

function viewByDepartment() {
    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) throw err;
        console.log(results);
        inquirer.prompt({
            name: "viewbyDepartment",
            type: "rawlist",
            message: "What department's employees would you like to view?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
            }
        })
        .then(function(answer) {
            if (answer.viewbyDepartment === results.viewByDepartment){
                console.log("In view by department condition.")
                connection.query("SELECT * FROM departments LEFT JOIN departments ON departments.id = id WHERE departments.name = ?", ["Developers"],
                function(err, res) {
                    if (err) throw err;
                    console.log(res);
                })
            }
        })
        .catch(error => {
            console.log(error)
        });
    })
}

function addDepartment() {
    inquirer
        .prompt({
            name: "addDepartment",
            type: "input",
            message: "What department would you like to add?"
        })
        .then(function (answer) {
        //   Query database to add a department
        connection.query("INSERT INTO departments SET ?", {name : answer.addDepartment}, function(err, results) {
            if (err) throw err;
            console.log("Sucessfully added department ", results);
            start();
        })
    });
}
function addRole() {
    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) throw err;
        console.log(results);
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the name of this role?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary of this role?"
            },
            {
                name: "departmentLink",
                type: "list",
                message: "What department does this role belong to?",
                choices: results
            }
        ])
        .then(function (answer) {
            //  Query database to add a role
            let depId;
            results.forEach(element => {
                console.log(element, "this is line 79");
              if (element.name === answer.departmentLink) {
                depId = element.id;
              }
            });
            connection.query("INSERT INTO roles SET ?", [
                {
                    title : answer.roleTitle, 
                    salary : answer.roleSalary, 
                    department_id : depId
                }
            ], 
            function(err, results) {
                if (err) throw err;
                console.log("Sucessfully added to roles ", answer.roleTitle, answer.roleSalary, answer.departmentLink)
                start();
                })
        });
    });
}

function addEmployee() {
    connection.query("SELECT * FROM roles", function(err, results) {
    if (err) throw err;
    console.log(results, " from roles");
    inquirer
        .prompt([
            { // Prompt for Employee's first name.
            type: "input",
            name: "firstName",
            message: "What is your first name?",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            }
        }, 
        { // Prompt for Employee's last name.
            type: "input",
            name: "lastName",
            message: "What is your last name?",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            }
        },
        {
            name: "roleName",
            type: "list",
            message: "What role is this employee under?",
            choices: function() {
                let roleArray = []
                results.forEach(element => {
                  roleArray.push(element.title);
                })
                console.log(roleArray, "Line 137");
                return roleArray
              }
        }
        ])
        .then(function (answer) {
            //  Query database to add an employee.
            let roleId;
            results.forEach(element => {
                console.log(element, "this is line 145");
                if (element.title === answer.roleName) {
                    roleId = element.id;
                    connection.query("INSERT INTO employees SET ?", 
                    [
                        {first_name : answer.firstName, 
                        last_name : answer.lastName,
                        role_id : roleId}
                    ], 
                    function(err, results) {
                        if (err) throw err;
                        console.log("Sucessfully added to employees ", answer.firstName, answer.lastName, answer.role_id);
                        start();
                     });
                }
            });
        });
    });
}

function start() {
    inquirer
      .prompt({
        name: "calltoAction",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", 
        "View All Employees by Department", 
        "Add Employee",
        "Remove Employee",
        "Add Department",
        "Add Roles",
        "Remove Roles",
        "Remove Departments",
        "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.calltoAction === "View All Employees") {
            //   Query database to get all employee records.
            connection.query("SELECT * FROM employees", function(err, results) {
                if (err) throw err;
                console.log(results);
            })
         
        } 
        else if (answer.calltoAction === "View All Employees by Department") {
            viewByDepartment()
        }
        else if (answer.calltoAction === "Add Employee") {
            addEmployee()
        }
        else if (answer.calltoAction === "Add Department") {
            addDepartment()
        }
        else if (answer.calltoAction === "Add Roles") {
            addRole()
        }
        else {
            // quit clause here
            console.log("in else block on line 55");
        }
    })
    .catch(error => {
        console.log(error)
});
}

start();


// Prompt for adding Employee.

// Creating prompt for Engineer.
function CreateEngineer() {
    inquirer
        .prompt([
            { // Prompt for Employee's first name.
            type: "input",
            name: "firstName",
            message: "What is your first name?",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            }
        }, 
        { // Prompt for Employee's last name.
            type: "input",
            name: "lastName",
            message: "What is your last name?",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            }
        },
        { // Prompt for Employee's role.
            type: "rawlist",
            name: "role",
            message: "What is the Employee's role?",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            },
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
            }
        },
        { // Prompt for Engineer's GitHub;
            type: "input",
            name: "github",
            message: "What is the",
            validate: (answer) => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character."
            }
        } // Pushing results into Engineer constructor.
    ]).then(function(answers) {
        const engineer = new Engineer(
            answers.name,
            answers.id,
            answers.email,
            answers.github
        );
        teamMembers.push(engineer);
        console.log(teamMembers);
        // Run prompt to add another member.
        createTeam();
    });
}