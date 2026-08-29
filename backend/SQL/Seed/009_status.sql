INSERT INTO status (id, name)
VALUES (0, 'Draft'),
       (1, 'Active'),
       (2, 'Sold'),
       (3, 'Hold')
ON CONFLICT (name) DO NOTHING;

