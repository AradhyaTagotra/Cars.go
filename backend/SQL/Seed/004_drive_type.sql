INSERT INTO drive_type (name)
VALUES ('Four Wheel Drive'),
       ('Front Wheel Drive'),
       ('Rear Wheel Drive')
ON CONFLICT (name) DO NOTHING;
