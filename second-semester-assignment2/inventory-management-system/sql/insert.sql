--- Inserting sample users
INSERT INTO users (full_name, email, role)
VALUES
('Emmanuel Udo', 'ubryliant@companyx.com', 'ADMIN'),
('Mark Benson', 'mark@companyx.com', 'USER'),
('Sarah White', 'sarah@companyx.com', 'USER');


--- Inserting sample categories
INSERT INTO categories (category_name, category_description)
VALUES
('Electronics', 'Devices and gadgets including phones, laptops, and accessories.'),
('Furniture', 'Home and office furniture including chairs, tables, and desks.'),
('Clothing', 'Apparel for men, women, and children including casual and formal wear.'); 

--- Inserting sample products
INSERT INTO products (product_name, product_price, product_size, category_id, stock_quantity)
VALUES
('Smartphone Model X', 699.99, 'medium', 1, 50),
('Laptop Pro 15"', 1299.99, 'large', 1, 30),
('Ergonomic Office Chair', 199.99, 'large', 2, 20),
('Wooden Dining Table', 499.99, 'large', 2, 10),
('Men\'s Casual Shirt', 29.99, 'medium', 3, 100),
('Women\'s Formal Dress', 89.99, 'medium', 3, 80);

--- Inserting sample orders
INSERT INTO orders (user_id, product_id, quantity, order_status, approved_at, approved_by)
VALUES
(2, 1, 2, 'PENDING', NULL, NULL),
(3, 5, 3, 'APPROVED', '2024-01-15 10:30:00', 1),
(2, 3, 1, 'APPROVED', '2024-01-16 14:45:00', 1),
(3, 2, 1, 'PENDING', NULL, NULL),
(2, 6, 2, 'APPROVED', '2024-01-17 09:20:00', 1),
(3, 4, 1, 'PENDING', NULL, NULL);

