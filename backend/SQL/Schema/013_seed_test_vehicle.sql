INSERT INTO Vehicle (summary, description, make, model ,status, gearbox_type, fuel_type, body_type, mileage, price, no_of_doors, no_of_seats, first_registration_year)
VALUES(
    '2019 Honda City - well maintained',
    'Single owner, full service history.',
    (SELECT id FROM make WHERE name ='Honda'),
    'City',
    (SELECT id FROM status WHERE name = 'Active'),
    (SELECT id FROM gearbox_type WHERE name = 'Automatic'),
    (SELECT id FROM fuel_type WHERE name = 'Hybrid'),
    (SELECT id FROM body_type WHERE name = 'Saloon'),
    20000,
    650000,
    4,
    5,
    2019
);