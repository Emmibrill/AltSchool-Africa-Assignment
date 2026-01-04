--- inventory management system ERD schema

--- Create Database
CREATE DATABASE inventory_management_system;
--- Switch to the created database
USE inventory_management_system;


--- Create Tables for each entity
--- Table for Users
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) CHECK (user_role IN ('admin','user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Table for Categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Table for Products
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL CHECK (product_price >= 0),
    product_size VARCHAR(10) CHECK (product_size IN ('small', 'medium', 'large')) NOT NULL,
    category_id INT NOT NULL,
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);

--- Table for Orders
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    order_status VARCHAR(20) CHECK (
        (order_status = 'PENDING' AND approved_at IS NULL AND approved_by IS NULL) OR
        (order_status = 'APPROVED' AND approved_at IS NOT NULL AND approved_by IS NOT NULL)
    ) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_item
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_admin
        FOREIGN KEY (approved_by)
        REFERENCES users(user_id)
);

