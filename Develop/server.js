
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
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Exit"
        ]
    }).then(answers => {
        console.log(answers, " User selected the following.");
        switch (answers.action) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
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
            case "Delete a department":
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

addDepartments = () => {
    inquirer
    .prompt({
            name: "nameOfDepartment",
            type: "input",
            message: "What department would you like to add?",
        })
        .then(answers => {
            connection.query(`INSERT INTO departments (name) VALUES ("${answers.nameOfDepartment}")`,
            (err, res) => {
                if (err) throw err;
                console.log("You have added the following department: ", answers.nameOfDepartment);
                start();
        });
    });
}

addRoles = () => {
    connection.query("SELECT * FROM departments",  (err, res) => {
        inquirer.prompt([
            {
                message: "Enter the title name of role:",
                type: "input",
                name: "roleTitle"
            }, 
            {
                message: "Enter the salary for this role:",
                type: "input",
                name: "roleSalary"
            }, 
            {
                message: "To which department would you like to assign this role?",
                type: "list",
                name: "roleDepartment",
                choices: res.map(item => ({ name: item.name, value: item.id }))

            }
        ])
        .then(answers => {
            connection.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${answers.roleTitle}', '${answers.roleSalary}', ${answers.roleDepartment})`,  (err, res) => {
                if (err) throw err;
                console.log("You have added the following role: ", answers.roleTitle);
                start();
            });
        });
    });
}

addEmployees = () => {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Manager, id FROM employees`,  (err, res) => {
        connection.query(`SELECT DISTINCT title, id from roles`, (err, data) => {
            inquirer.prompt([
                {
                    message: "What is the employee's first name?",
                    type: "input",
                    name: "first_name"
                }, 
                {
                    message: "What is the employee's last name?",
                    type: "input",
                    name: "last_name"
                }, 
                {
                    message: "What is the employee's role?",
                    type: "list",
                    name: 'role_id',
                    choices: function () { 
                        // Function that returns 0 if employee being added has no role to select.
                        if (data.length > 0) {
                            console.log("There are roles to add to this employee.");
                            return data.map(item => ({ name: item.title, value: item.id }));
                        } else {
                            console.log("No roles to add to this employee.");
                            return 0;
                        }
                    }
                }, 
                {
                    message: "Who is the manager of this employee?",
                    type: "list",
                    name: 'manager_id',
                    choices: function () {
                        // Function that returns 0 if employee being added is the first.
                        if (res.length > 0) {
                            console.log("There are employees to add as manager.");
                            return res.map(item => ({ name: item.Manager, value: item.id })) 
                        } else {
                            console.log("No Employyes to add as manager.");
                            return [0];
                        }
                    }
                }
            ])
            .then(answers => {
                connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', ${answers.role_id}, ${answers.manager_id})`,  
                (err, res) => {
                    if (err) throw err;
                    console.log(`Woot! Employee ${answers.first_name} ${answers.last_name} has been successfully added`);
                    start();
                });
            });
        });
    });
};

updateEmployees = () => {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Employee, id FROM employees`, (err, res) => {
        connection.query(`SELECT title, id from roles`, (err, data) => {
            inquirer.prompt([
                {
                    message: "What is the name of the employee that you would like to update a role for?",
                    type: "list",
                    name: "updatedEmployee",
                    choices: res.map(item => ({ name: item.Employee, value: item.id }))
                }, 
                {
                    message: "What is the employee's new role?",
                    type: "list",
                    name: 'role_id',
                    choices: data.map(item => ({ name: item.title, value: item.id }))

                }
             ])
            .then(answers => {
                    connection.query(`UPDATE employees SET role_id = "${answers.role_id}" WHERE id= "${answers.updatedEmployee}"`, 
                    (err, res) => {
                        if (err) throw err;
                        console.log("Employee's role has been successfully updated.");
                        start();
                    });
                });
        });
    });
}

deleteDepartments = () => {
    connection.query("SELECT name, id FROM departments", (err, res) => {
        const departmentChoices = res.map(item => {
            return {
                name: item.name,
                value: item.id
            }
        });
        inquirer.prompt([{
            message: "Which department would you like to remove?",
            type: "list",
            name: "deleteDepartment",
            choices: departmentChoices
        }])
        .then((answers) => {
            let departmentChoice = departmentChoices.filter(item => item.value === answers.deleteDepartment);
            var query = `DELETE FROM departments WHERE id = "${answers.deleteDepartment}"`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Department ${departmentChoice[0].name} has been successfully deleted.`);
                start();
            });
        });
    });
};

deleteRoles = () => {
    connection.query("SELECT title, id FROM roles", (req, res) => {
        const roleChoices = res.map(item => ({
            name: item.title,
            value: item.id,
        }));
        inquirer.prompt([
            {
                name: "roleChoice",
                type: "list",
                message: "Choose a role you would like to delete: ",
                choices: roleChoices
            }
        ]).then(answers => {
            const chosenRole = roleChoices.filter(item => item.value === answers.roleChoice);
            let query = `DELETE FROM roles WHERE id = ${answers.roleChoice}`;
            connection.query(query,
                (err, res) => {
                    if (err) throw err;
                    console.log(`Role ${chosenRole[0].name} has been successfully deleted.`);
                    start();
                });
        });
    });
}

deleteEmployees = () => {
    connection.query("SELECT CONCAT(first_name, ' ', last_name) AS fullName, id FROM employees", (err, res) => {
        const employeeChoices = res.map(item => ({
            name: item.fullName,
            value: item.id,
        }));
        inquirer.prompt([
            {
                name: "employeeChoice",
                type: "list",
                message: "Choose a employee you would like to delete: ",
                choices: employeeChoices
            }
        ]).then(answers => {
            const chosenEmployee = employeeChoices.filter(item => item.value === answers.empChoice);
            let query = `DELETE FROM employees WHERE id = ${answers.employeeChoice}`;
            connection.query(query,
                (err, res) => {
                    if (err) throw err;
                    console.log(`Employee ${employeeChoices[0].name} has been successfully deleted.`);
                    start();
                });
        });
    });
}

