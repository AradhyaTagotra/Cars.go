INSERT INTO gearbox_type (name)
VALUES ('Automatic'),
       ('Manual')
ON CONFLICT (name) DO NOTHING;
