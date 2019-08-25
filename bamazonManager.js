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
      displayInventory();
      break;
    
    case "View Low Inventory":
      viewLowInventory();
      break;
    
    case "Add to Inventory":
      addInventoryPrompt();
      break;
    
    case "Add New Product":
      addNewProductPrompt();
      break;
    case "Exit":
      connection.end();
      break;
  }
}

function displayInventory() {
  let tableData = [];
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
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
    menuOptions();
  })
}

function viewLowInventory() {
  let tableData = [];
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
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
    menuOptions();
  })
}

function addInventoryPrompt() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Please input the ID of the product you would like to add more",
        filter: Number
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to add to the inventory?",
        filter: Number
      }
    ])
    .then(function(answer) {
      var id = answer.ID;
      var addQuantity = answer.quantity;
      addInventory(id, addQuantity);
    })
}

function addInventory(id, addQuantity) {
  connection.query("SELECT * FROM products WHERE id =" + id, function(err, product) {
    if (err) throw err;
    var name = product[0].product_name;
    var newQuantity = product[0].stock_quantity + addQuantity;
    console.log("You added " + addQuantity + " more " + name + " to the inventory");

    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuantity
        },
        {
          id: id
        }
      ]
    )

  })
  menuOptions();
}

