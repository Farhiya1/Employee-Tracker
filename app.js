// Dependencies
const { prompts } = require("inquirer");
const inquirer = require("inquirer");
var mysql2 = require("mysql2");
const consoleTable = require("console.table");

// Create connection to mysql
var connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "employee_db",
});

// Connect to the server
connection.connect((err) => {
  if (err) {
    // If there's an error return Error.
    console.log("Error!!", err);
  } else {
    // You are Connected
    console.log("You are connected to the MySQL Server");
    userOptions();
  }
});

// Function for users options
function userOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all employees",
        "View all roles",
        "Add a department",
        "Add an employee",
        "Add a role",
        "Update a role",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all departments":
          viewDepartment();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Update a role":
          updateRole();
          break;
      }
    });
}

// View all departments in the database
function viewDepartment() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " departments exist!");
    console.table("All departments:", res);
    userOptions();
  });
}

// view all employees in the database
function viewEmployees() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " employees exist!");
    console.table("All Employees:", res);
    userOptions();
  });
}

// view all roles in the database
function viewRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " roles exist!");
    console.table("All Roles:", res);

    userOptions();
  });
}

// add a department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "Which department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        name: answer.newDepartment,
      });
      var query = "SELECT * FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Your department has been added!");
        console.table("All Departments:", res);
        userOptions();
      });
    });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name? ",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name? ",
        },
        {
          name: "manager_id",
          type: "input",
          message: "What is the employee's manager's ID? ",
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            var roleArray = [];
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }
            return roleArray;
          },
          message: "What is this employee's role? ",
        },
      ])
      .then(function (answer) {
        let role_id;
        for (let x = 0; x < res.length; x++) {
          if (res[x].title == answer.role) {
            role_id = res[x].id;
            console.log(role_id);
          }
        }
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: answer.manager_id,
            role_id: role_id,
          },
          function (err) {
            if (err) throw err;
            console.log("You have successfully added your employee!");
            userOptions();
          }
        );
      });
  });
}

// add a role to the database
function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "new_role",
          type: "input",
          message: "What new role would you like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of this new role? (Enter an amount)",
        },
        {
          name: "Department",
          type: "list",
          choices: function () {
            var departmentArray = [];
            for (let i = 0; i < res.length; i++) {
              departmentArray.push(res[i].name);
            }
            return departmentArray;
          },
        },
      ])
      .then(function (answer) {
        let department_id;
        for (let x = 0; x < res.length; x++) {
          if (res[x].name == answer.Department) {
            department_id = res[x].id;
          }
        }

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.new_role,
            salary: answer.salary,
            department_id: department_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("You have successfully added a new role!");
            console.table("All Roles:", res);
            userOptions();
          }
        );
      });
  });
}

const updateRole = () => {
  //get all the employee list
  connection.query("SELECT * FROM EMPLOYEE", (err, res) => {
    if (err) throw err;
    const employeeChoice = [];
    res.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    //get all the role list to make choice of employee's role
    connection.query("SELECT * FROM ROLE", (err, res) => {
      if (err) throw err;
      const roleChoice = [];
      res.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "whose role do you want to update?",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "what is the employee's new role?",
        },
      ];

      inquirer
        .prompt(questions)
        .then((response) => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          connection.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;

              console.log("successfully updated employee's role!");
              userOptions();
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
};
