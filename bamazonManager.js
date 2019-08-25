// Running this application will:

//   * List a set of menu options:

//     * View Products for Sale
    
//     * View Low Inventory
    
//     * Add to Inventory
    
//     * Add New Product

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

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
  menuOptions();
});

// ________________________________________
// FUNCTIONS
// ========================================

function menuOptions() {
  inquirer
    .prompt([
      {
        name: "menuOptions",
        type: "list",
        message: "Please select below menu options",
        choices: [
          "View Products for Sale",
          "View Low Inventory", 
          "Add to Inventory", 
          "Add New Product",
          "Exit"
          ]
      }
    ])
    .then(function(res) {
      var option = res.menuOptions;
      console.log(option);
      doOption(option);
    }) 
}

function doOption(option) {
  // switch that takes in option as parameter
  switch(option) {
    case "View Products for Sale":
      viewProducts();
      break;
    
    case "View Low Inventory":
      viewLowInventory();
      break;
    
    case "Add to Inventory":
      addInvnetory();
      break;
    
    case "Add New Product":
      addNewProduct();
      break;
    case "Exit":
      connection.end();
      break;
  }
}

