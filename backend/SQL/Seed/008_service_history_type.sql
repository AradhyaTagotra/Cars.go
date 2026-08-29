INSERT INTO service_history_type (name)
VALUES ('Full'),
       ('Partial'),
       ('Not Available')
ON CONFLICT (name) DO NOTHING;
