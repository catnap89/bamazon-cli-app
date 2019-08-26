//  * View Product Sales by Department
   
//  * Create New Department

//  When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.


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
        message: "Please select from below options.",
        choices: [
          "View Departments",
          "View Product Sales by Department",
          "Create New Department",
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
    case "View Product Sales by Department":
      displaySales();
      break;
    
    case "Create New Department":
      createDepartment();
      break;

    case "View Departments":
      displayDepartment();
      break;

    case "Exit":
      connection.end();
      break;
  }
}

function displaySales() {
  let tableData = [];
  var query = "SELECT department_id, departments.department_name, over_head_costs, "
            + "SUM(products.product_sales) AS product_sales, "
            + "SUM(products.product_sales) - departments.over_head_costs AS total_profit ";
  query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
  query += "GROUP BY department_id ORDER BY department_id";   // I BELIEVE GROUP BY ALLOWED THE SUM OF THE PRODUCT_SALES TO BE CATEGORIZED BY EACH DEPARTMENT
  connection.query(query, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var departmentID = "Department ID: " + res[i].department_id;
      var departmentName = "Department Name: " + res[i].department_name;
      var overheadCosts = "Overhead Costs: $" + res[i].over_head_costs;
      var productSales = "Product Sales: $" + res[i].product_sales;
      var totalProfit = "Total Profit: $" + res[i].total_profit;
 
      let data;
      data = [departmentID, departmentName, overheadCosts, productSales, totalProfit];
      tableData.push(data);
      // console.log(res[i]);
    }
    var output = table(tableData);
    console.log(output);
    menuOptions();
  })
}

// let's make view departments to view departments in the database
// for situation like when new departments were created but no products were listed with the newly created departments
function displayDepartment() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    let tableData = [];
    res.forEach(element => {
      let departmentName = element.department_name;
      let departmentID = "ID: " + element.department_id
      let data;
      data = [departmentID, departmentName];
      tableData.push(data);
    });
    var output = table(tableData);
    console.log(output);
    menuOptions();
  })
}

function createDepartment() {
  // department_name, over_head_costs
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the new department?"
      },
      {
        name: "overheadCost",
        type: "number",
        message: "Please enter overhead cost of the new department."
      }
    ])
    .then(function(res) {
      var departmentName = res.name;
      var ohcost = res.overheadCost;

      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: departmentName,
          over_head_costs: ohcost
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department created!\n");
          menuOptions();
        }
      )
    })
}

// let's make delete departments to delete unncessary departments or departments with typo, etc.


