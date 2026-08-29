INSERT INTO emission_standard_type (name)
VALUES ('Euro 1'),
       ('Euro 2'),
       ('Euro 3'),
       ('Euro 4'),
       ('Euro 5'),
       ('Euro 6')
ON CONFLICT (name) DO NOTHING;
