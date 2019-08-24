// ________________________________________
// DEPENDENCIES
// ========================================
var mysql = require("mysql");
var inquirer = require("inquirer");

// ________________________________________
// mySQL
// ========================================
var connection = mysql.createConnection({   // create the connection information for the sql database
  host: "localhost",
  port: 3306,                               // Your port; if not 3306
  user: "root",                             // Your username
  password: "",                             // Your password
  database: "bamazon"
});

