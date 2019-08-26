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
          "Remove Product from Inventory",
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
      displayLowInventory();
      break;
    
    case "Add to Inventory":
      restockPrompt();
      break;
    
    case "Add New Product":
      newProductPrompt();
      break;
    
    case "Remove Product from Inventory":
      removePrompt();
      break;

    case "Exit":
      connection.end();
      break;
  }
}

function displayInventory() {
  console.log("Products in Bamazon inventory that has stock quantity higher than 0");
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

function displayLowInventory() {
  console.log("Products with quantity lower than 5 in Bamazon inventory.");
  let tableData = [];
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    if (res.length > 0) {         // if there is at least one product that has lower than 5 stock quantity,
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

    } else {
      console.log("All Items are available to sell!");
      menuOptions();
    }
  })
}

function restockPrompt() {
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
      restock(id, addQuantity);
    })
}

function restock(id, addQuantity) {
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

function newProductPrompt() {
  var department = []; 
  connection.query("SELECT DISTINCT department_name FROM departments", function(err, res) { //used DISTINCT just in case department with same name was added more than once from bamazonSupervisor.js by accident
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      department.push(res[i].department_name);
    }
  })

  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the product to add to Bamazon inventory?"
      },
      {
        name: "department",
        type: "list",
        message: "Which department is the product categorized as?",
        choices: department
      },
      {
        name: "price",
        type: "number",
        message: "What is the price of the product?"
      },
      {
        name: "quantity",
        type: "number",
        message: "How many items do you want to add to the inventory?"
      }
    ])
    .then(function(res) {
      var name = res.name;
      var department = res.department;
      var price = res.price;
      var quantity = res.quantity;

      addNewProduct(name, department, price, quantity);
    })
}

function addNewProduct(name, department, price, quantity) {
  connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: quantity
    }
  )
  console.log("Following product was added as a new product!\n" +
  "Name: " + name + " |" + " Department: " + department + " | " + " Price: " + price + " | " + " Quantity: " + quantity);
  menuOptions();
}

function removePrompt() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "number",
        message: "Input ID of the product you wish to remove from the inventory. The item will be removed completely!"
      },
      {
        name: "confirmation",
        type: "confirm",
        message: "Are you sure you want to remove this item?",
        default: false
      }
    ])
    .then(function(res) {
      var id = res.ID;
      var confirmation = res.confirmation;
      if (confirmation) {
        removeProduct(id);
      } else {
        console.log("You cancelled removing product from the inventory");
        menuOptions();
      }
    })
}

function removeProduct(ID) {

  connection.query("SELECT * FROM products WHERE id=" + ID, function(err, res) {
    if (err) throw err;

    var id = "ID: " + res[0].id;
    var name = "Name: " + res[0].product_name;
    var department = "Department: " + res[0].department_name;
    var price = "Price: $" + res[0].price;
    var quantity = "Quantity: " + res[0].stock_quantity;
    let data;

    data = [
      [id, name, department, price, quantity]
    ];
    var output = table(data);
    console.log("\n\n" + "Following product has been removed from the inventory \n" + output + "\n");
    connection.query(
      "DELETE FROM products WHERE ?",
      {
        id: ID
      }
    )

    menuOptions();
  })

}
