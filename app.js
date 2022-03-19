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

