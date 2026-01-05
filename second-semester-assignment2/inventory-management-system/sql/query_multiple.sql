-- query from multiple tables to get order details along with user and product information using JOINs
SELECT o.order_id, u.user_name AS ordered_by, p.product_name AS ordered_product, o.quantity, o.order_status, o.created_at AS order_date, c.category_id AS product_category
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
INNER JOIN products p ON o.product_id = p.product_id
LEFT JOIN categories c ON p.category_id = c.category_id; 