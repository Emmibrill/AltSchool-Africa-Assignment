
--- Retrieve item details along with their category names
SELECT p.product_name, p.product_price, p.product_size, c.category_id AS category
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id;

--- Retrieve all orders with user and item details
SELECT o.order_id, u.user_name AS ordered_by, p.name AS ordered_product, o.quantity, o.order_status
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
INNER JOIN products p ON o.product_id = p.product_id;
    
--- Retrieve all categories with the count of items in each category
SELECT c.category_id AS category_id, c.name AS category_name, COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_id, c.name;

--- Retrieve all users with their roles
SELECT user_id, full_name, email, user_role
FROM users;

--- Retrieve all products that are low in stock (less than 20 units)
SELECT product_id, product_name, stock_quantity
FROM products
WHERE stock_quantity <= 20;

