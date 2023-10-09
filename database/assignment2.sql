-- Insert data to account table
INSERT INTO public.account (account_firstname
,   account_lastname
,   account_email
,   account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify record in account table
UPDATE public.account
SET account_type = 'Admin' 
WHERE account_id = 1;

-- Delete Tony Stark record from the database
DELETE FROM public.account
WHERE account_id = 1;

-- Modify from "small interiors" to "a huge interior"
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Inner Join inventory and classification
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM public.inventory
INNER JOIN public.classification ON inventory.inv_id = classification.classification_id
WHERE classification.classification_id = 2;

-- Update image paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');