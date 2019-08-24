DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

-- * item_id (unique id for each product)

-- * product_name (Name of product)

-- * department_name

-- * price (cost to customer)

-- * stock_quantity (how much of the product is available in stores)

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

-- * Departments: clothing / electronics / 