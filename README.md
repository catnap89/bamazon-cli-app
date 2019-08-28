# bamazon-cli-app
Bamazon is a Amazon-like storefront command-line interface application using node.js and MySQL to store, request, and display data. The bamazonCustomer.js is for the customers to view items and place orders on an available product in Bamazon's inventory. The bamazonManager.js is for managers to perform product sales tracking, inventory control and add/remove products. And finally bamazonSupervisor is for supervisors to track department profitability and add/remove departments. 

## Getting Started

- Clone down repo.
- Node.js - Download the latest version of Node https://nodejs.org/en/
- Run command 'npm install' in Terminal or GitBash to install npm packages dependencies needed for this app.
- **Create .env file to store your MySQL Password.** This file will be used by the `dotenv` package to set what are known as environment variables to the global `process.env` object in node. These are values that are meant to be specific to the computer that node is running on, and since we are gitignoring this file, they won't be pushed to github; keeping our API key information private.
- Open MySQL Workbench and open the "bamazon.sql" script from the cloned repo, and run it to set up the database, product/department data tables and mock data inside the tables to start with.
- Run one of the commands below in Terminal or GitBash.

## What Each Command Does

#### For Customers
`node bamazomCustomer.js`

  * Running this command will display all of the items available for sale. Include the ids, names, and prices of products for sale. The app should then prompt users with two messages asking the customers for

    * ID of the product they would like to buy
    * how many units of the product they would like to buy
  
  * Once the customer has placed the order, the application checks if the store (product table in bamazon's database) has enough of the product to meet the customer's request.

    * If not, the app logs `Bamazon does have enough [PRODUCT NAME] in stock to complete your order. Please try again...`, and then prevent the order from going through.

    * However, if the store _does_ have enough of the product, the app fulfills the customer's order by updating the SQL database to reflect the remaining quantity.

    * Once the update goes through, the app shows the customer the total cost of their purchase.

#### For Managers
`node bamazonManager.js`

  * Running this command will display list of options to choose from in terminal/bash window. The options are
    * View Product for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product
    * Remove Product from Inventory
    * Exit

  * When `View Product for Sale` option is selected:
    * Displays products in Bamazon inventory that has stock quantity higher than 0 and their info (ID, Name, Price, Quantity) as a table in the console.
  * When `View Low Inventory` option is selected:
    * Display all items with an inventory count lower than 5 as a table in the console.
  * When `Add to Inventory` option is selected:
    * App displays a prompt to ask **ID** and **Quantity** of the item that is currently in the bamazon's product database to restock that item.
  * When `Add New Product` option is selected:
    * App displays a prompt to ask **Product Name**, **Name of the Department**, **Price**, and **Quantity** about the product the manager wants to add to the database.
  * When `Remove Product from Inventory` is selected: 
    * App displays a prompt to ask **ID** of the product the manager wish to remove from Bamazon and it's database and ask for the **Confirmation**
  * When `Exit` is selected:
    * Exit out of the application.

#### For Supervisors
`node bamazonSupervisor.js`

  * Running this command will display list of options to choose from in terminal/bash window. The options are
    * View Departments
    * View Product Sales by Department
    * Create New Department
    * Remove Department
    * Exit

  * When `View Departments` option is selected:
    * Displays all existing departments
  * When `View Product Sales by Department` option is selected:
    * Displays department ID, department name, overhead cost, product sales and total profit (Product sales - overhead costs) as a table in the console.
  * When `Create New Department` option is selected:
    * App displays a prompt to ask **Department Name**, **Overhead cost** about the department the supervisor wants to add to the database.
  * When `Remove Department` option is selected:
    * App displays a prompt to ask **Department ID** of the department that Supervisor wants to remove from the Bamazon's MySQl database.

## Video of the App functioning
Here are the links to the Youtube video of the app to show its functionality.

### bamazonCustomer.js
[![Watch the video](https://img.youtube.com/vi/YXkA2kq57_I/maxresdefault.jpg)](https://youtu.be/YXkA2kq57_I)

### bamazonManager.js 
[![Watch the video](https://img.youtube.com/vi/l_5tJy765hI/maxresdefault.jpg)](https://youtu.be/l_5tJy765hI)

### bamazonSupervisor.js 
[![Watch the video](https://img.youtube.com/vi/DatCsTtqb-0/maxresdefault.jpg)](https://youtu.be/DatCsTtqb-0)


## Tech used
- JavaScript
- Node.js
- MySQL - https://www.mysql.com/
- MySQL NPM Package - https://www.npmjs.com/package/mysql
- inquirer NPM Package - https://www.npmjs.com/package/inquirer
- DotEnv NPM Package - https://www.npmjs.com/package/dotenv
- Table NPM Package - https://www.npmjs.com/package/table
- .gitignore - to tell git not to track files such as node_modules and .env and thus they won't be committed to Github.

## Authors

* **Youngwoo Cho** - *Node JS & MySQL* - [Youngwoo Cho](https://github.com/catnap89)