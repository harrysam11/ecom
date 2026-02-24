SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
ORDER BY column_name;
