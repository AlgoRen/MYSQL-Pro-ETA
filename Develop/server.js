
const mysql = require("mysql");
const consoleTable = require("console.table");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "hardfliprails",
    database: "companyPersonnel_db"
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Select a following option...",
        choices: [
            "View all employees",
            "View all departments",
            "View all roles",
            "View all employees by manager",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Exit"
        ]
    }).then(answer => {
        console.log(answer, " User selected the following.");
        switch (answer.action) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees by manager":
                viewEmployeeManagers();
                break;
            case "Add a department":
                addDepartments();
                break;
            case "Add a role":
                addRoles();
                break;
            case "Add an employee":
                addEmployees();
                break;
            case "Update an employee role":
                updateEmployees();
                break;
            case "Delete a departments":
                deleteDepartments();
                break;
            case "Delete a role":
                deleteRoles();
                break;
            case "Delete an employee":
                deleteEmployees();
                break;
            case "Exit":
                console.log('Thanks for using ETA!');
                connection.end();
                break;
        }
    })
}

viewEmployees = () => {
    let query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees ";
    query += "LEFT JOIN roles ON employees.role_id = roles.id ";
    query += "LEFT JOIN departments ON roles.department_id = departments.id ";
    query += "LEFT JOIN employees manager ON manager.id = employees.manager_id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('List of all employees: \n');
        console.table(res);
        start();
    });
}

viewDepartments = () => {
    console.log("List of all departments: \n");
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

viewRoles = () => {
    console.log("List of all roles: \n");
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        console.table(res); 
        start();
    });
}