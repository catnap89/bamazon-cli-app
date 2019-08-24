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
    purchase();
  });
}

function purchase() {
  connection.query("SELECT * FROM products", function(err, products) {    // query the database for all products being auctioned
    if (err) throw err;

    inquirer        // once you have the products, prompt the user for which product they would like to purchase and how many
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < products.length; i++) {
              choiceArray.push(products[i].id);
            }
            return choiceArray;
          },
          message: "What product would you like to purchase?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to purchse?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < products.length; i++) {
          if (products[i].id === answer.choice) {
            chosenItem = products[i];
          }
        }

        // determine if stock_quantity was enough for user to purchase quantity
        if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
          // if stock_quantity was high enough, so update db, let the user know, and show the total cost to user, start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItem.stock_quantity - answer.quantity
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Successfully purchased product! You spent $" + chosenItem.price * answer.quantity);
              // showProducts();
              connection.end();
            }
          );
        }
        else {
          // Stock_quantity wasn't high enough, so apologize and start over
          console.log("Bamazon does have enough products in stock to complete your order. Try again...");
          purchase();
        }
      });
  });

}

