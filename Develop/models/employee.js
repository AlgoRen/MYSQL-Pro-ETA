// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var employees = { // Object for employees table for ORM functions.
  all: function(cb) {
    orm.all("employees", function(res) {
      cb(res);
    });
  },
  // A function that allows user to view all employees based on department.
  employeesByDepartment: function(tableInput, colToSearch, valofCal, cb) {
      orm.selectWhere(tableInput, colToSearch, valofCal, function(res) {
          cb(res);
      });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("employees", cols, vals, function(res) {
      cb(res);
    });
  },
  update: function(objColVals, condition, cb) {
    orm.update("employees", objColVals, condition, function(res) {
      cb(res);
    });
  }
};

var departments = {
    all: function(cb) {
        orm.all("departments", function(res) {
          cb(res);
        });
      },
      // A function that allows user to view all employees based on department.
      employeesByDepartment: function(tableInput, colToSearch, valofCal, cb) {
          orm.selectWhere(tableInput, colToSearch, valofCal, function(res) {
              cb(res);
          });
      },
      // The variables cols and vals are arrays.
      create: function(cols, vals, cb) {
        orm.create("departments", cols, vals, function(res) {
          cb(res);
        });
      },
      update: function(objColVals, condition, cb) {
        orm.update("departments", objColVals, condition, function(res) {
          cb(res);
        });
      }
}
// Export the database functions for the controller (catsController.js).
module.exports = employees;
