const inquirer = require("inquirer");
const employee = require("./models/employee");
const department = require("./models/department");

// Getting all department names and exporting it as an array.
const getDepartments = department.all(function(data) {
    var allDepartments = {
        // Google how to get rid of row packet data.
        departments: data
    };
    var departmentNames = []; // A for each look to get name references.
    allDepartments.departments.forEach(list => {
        console.log(list.name);
        departmentNames.push(list.name)
        return departmentNames;
    });
   
});

console.log('ALL_DEPARTMENTS__>', getDepartments);
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
                var allEmployees = {
                    employees: data
                };
                console.log("All Employees ------>", allEmployees);
            })
        } 
        else if (answer.calltoAction === "View All Employees by Department") {
            viewByDepartment()
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

function viewByDepartment() {
    inquirer
    .prompt(
      {
        name: "EmployeesBydepartments",
        type: "rawlist",
        message: "Choose a department to view employees by.",
        choices: async function() {
            var departmentNames = []; // A for each look to get name references.
            const allDepartments = await department.all(function(data, cb) {
            // var allDepartments = {
            //     // Google how to get rid of row packet data.
            //     departments: data
            // };
            data.forEach(list => {
                console.log(list.name);
                departmentNames.push(list.name)
            });
            console.log(departmentNames, "department names");

            // return departmentNames
            })
            console.log(departmentNames, "This 2nd return");
            return departmentNames;

    }})
    .then(function(departmentList) {
        inquirer.prompt({
            type: 'list',
            name: 'departmentList',
            choices: departmentList

        }).then(answer=> {
            console.log(`ANSWER-->`, answer)
        }).catch(err => {
            console.log(err)
        })
        // get the information of the chosen item
        if (answer.EmployeesBydepartments === "Develop") {
            console.log("Successfully selected Develop");
        }
    }).catch(err => {
        console.log(err);
    });

}

// Function calls.
start();
