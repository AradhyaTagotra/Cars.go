INSERT INTO body_type (name)
VALUES	  ('Convertible'),
          ('Coupe'),
          ('Estate'),
          ('Hatchback'),
          ('MPV'),
          ('Pickup'),
          ('Saloon'),
          ('SUV'),
          ('Camper'),
          ('Limousine'),
          ('Minibus'),
          ('Van'),
          ('Other')
ON CONFLICT (name) DO NOTHING;
