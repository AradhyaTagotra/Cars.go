INSERT INTO category_type (name)
VALUES	('A'), ('B'), ('S'), ('N')
ON CONFLICT (name) DO NOTHING;