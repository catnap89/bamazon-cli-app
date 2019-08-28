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
  price DECIMAL(20,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(20,2),
  PRIMARY KEY (id)
);

-- Mock Data to start with
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("white shirts", "clothing", 80, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("blue jeans", "clothing", 90, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("grey hoodie", "clothing", 50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("brown loafer", "clothing", 100, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("black slacks", "clothing", 80, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("2080TI GPU", "electronics", 480, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("32in 144Hz qhd monitor", "electronics", 700, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("16GB RAM", "electronics", 250, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Intel 9900K CPU", "electronics", 420, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Realforce Keyboard", "electronics", 200, 10);


CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  over_head_costs DECIMAL(20,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 1000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("clothing", 500);


