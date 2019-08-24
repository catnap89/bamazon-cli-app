// ________________________________________
// DEPENDENCIES
// ========================================
require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var mysqlPass = require("./mysqlPass");
// ________________________________________
// MYSQL CONNECTION
// ========================================
var connection = mysql.createConnection({   // create the connection information for the sql database
  host: "localhost",
  port: 3306,                               // Your port; if not 3306
  user: "root",                             // Your username
  password: mysqlPass.mysqlConnect,         // Your password stored in .env
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showProducts();
});

// ________________________________________
// FUNCTIONS
// ========================================
function showProducts() {                   // Display All Products
  var query = connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var id = res[i].id;
      var name = res[i].product_name;
      var department = res[i].department_name;
      var price = res[i].price;
      var quantity = res[i].stock_quantity;
      console.log("ID: " + id + " | " + "Name: " + name + " | " + "Department: " + department + " | " + "Price: " + "$"+ price + " | " + "Quantity: " + quantity);
      // console.log("ID: " + id + " Name: " + name + " Department: " + department + " Price: " + "$"+ price + " Quantity: " + quantity);
    }
    console.log(query.sql);       // logs the actual query being run
    connection.end();
  });
}

