// ________________________________________
// DEPENDENCIES
// ========================================
require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var mysqlPass = require("./mysqlPass");
const {table} = require('table');
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
  let tableData = [];
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var id = "ID: " + res[i].id;
      var name = "Name: " + res[i].product_name;
      var department = "Department: " + res[i].department_name;
      var price = "Price: $" + res[i].price;
      var quantity = "Quantity: " + res[i].stock_quantity;
 
      let data;
      data = [id, name, department, price, quantity];
      tableData.push(data);
    }
    var output = table(tableData);
    console.log(output);
    purchasePrompt();
  });
}

function purchasePrompt() {
  inquirer      
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Please input ID of the product you would like to purchase",
        filter: Number
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchse?",
        filter: Number
      }
    ])
    .then(function(answer) {
      var orderAmt = answer.quantity;
      var id = answer.ID;
      purchaseOrder(id, orderAmt);
    });
}

function purchaseOrder(id, orderAmt) {
  connection.query("SELECT * FROM products WHERE id = " + id, function(err, product) {    // query the database about the product with same ID as user choice
    if (err) throw err;
    var name = product[0].product_name;
    var stockQuantity = product[0].stock_quantity;
    var totalCost = product[0].price * orderAmt;
    if (orderAmt <= stockQuantity) {             // determine if stock_quantity was enough for user to purchase quantity
      console.log("Successfully purchased " + orderAmt + " " + name + "!"+ "Total cost: $" + totalCost);
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: stockQuantity - orderAmt
          },
          {
            id: id
          }
        ]
      )
    } else {
      console.log("Bamazon does have enough " + name + " in stock to complete your order. Please try again...");
      showProducts();
    }
    connection.end();
  });

}
