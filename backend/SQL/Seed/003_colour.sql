INSERT INTO colour (name)
VALUES	('Black'),
          ('Blue'),
          ('Grey'),
          ('White'),
          ('Silver'),
          ('Red'),
          ('Green'),
          ('Beige'),
          ('Bronze'),
          ('Brown'),
          ('Gold'),
          ('Multicolor'),
          ('Orange'),
          ('Pink'),
          ('Purple'),
          ('Yellow'),
          ('Other')
ON CONFLICT (name) DO NOTHING; 
