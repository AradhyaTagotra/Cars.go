INSERT INTO fuel_type (name)
VALUES ('Petrol'),
       ('Diesel'),
       ('Electric'),
       ('Hybrid'),
       ('Other')
ON CONFLICT (name) DO NOTHING;