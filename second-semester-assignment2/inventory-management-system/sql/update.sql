
-- update queries for inventory management system

-- 1. Update product price
UPDATE products
SET product_price = 749.99 -- assuming old price was 699.99 and we are increasing it to 749.99
WHERE product_id = 1;  -- Update price of 'Smartphone Model X' assuming its product_id is 1

-- 2. Update stock quantity after a new shipment
UPDATE products
SET stock_quantity = stock_quantity + 20
WHERE product_id = 3; 

-- 3. Change order status from PENDING to APPROVED
UPDATE orders
SET order_status = 'APPROVED',
    approved_at = CURRENT_TIMESTAMP,
    approved_by = 1  -- Assuming admin user_id is 1
WHERE order_id = 1;  -- Update order with order_id 1    

-- 4. Update user role
UPDATE users
SET user_role = 'ADMIN'
WHERE user_id = 2;  -- Promote user with user_id 2 to ADMIN