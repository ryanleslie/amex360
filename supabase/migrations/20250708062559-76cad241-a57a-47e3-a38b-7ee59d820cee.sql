-- Update card_balances with correct plaid_account_ids from primary_cards.csv
UPDATE card_balances SET plaid_account_id = 'NYJO5DK4pxtX8xzbZ6jPIEdozLX1pyfz4kNQBz' WHERE "cardType" = 'Business Platinum Card';
UPDATE card_balances SET plaid_account_id = 'ekMY6dRrOLUjROmaz4KeH7Qn3kNLEvU9RKyYvQ' WHERE "cardType" = 'Business Green';
UPDATE card_balances SET plaid_account_id = 'Xe8YqvJ7pVtALqYrox0bCjydp0zEBeIj9nvyBw' WHERE "cardType" = 'Charles Schwab Platinum Card';
UPDATE card_balances SET plaid_account_id = '9VAyLMgQXNIOo3BbqEKNHV0zZLR4YgtJnB54ny' WHERE "cardType" = 'Business Rose Gold';
UPDATE card_balances SET plaid_account_id = '77KBwzo3XpF6XkzO49D1cgX1xaJRyDsZgL7Egz' WHERE "cardType" = 'Business Blue Plus I';
UPDATE card_balances SET plaid_account_id = 'OeOYa1kZpJtmD7OKbx8QI9NxrVKzPjuPjRLej5' WHERE "cardType" = 'Amazon Business Prime';
UPDATE card_balances SET plaid_account_id = 'nJ4YK3P5Nkf5EJ93YmVeUdyOn0ZkoqCXK9ONK5' WHERE "cardType" = 'Business Classic Gold';
UPDATE card_balances SET plaid_account_id = 'Eeb8ZM6XpKtB4ejq9Xo1UX7xVKB0RqIq4Dj84v' WHERE "cardType" = 'Delta SkyMiles® Reserve';
UPDATE card_balances SET plaid_account_id = 'pZ4wNKBobvfVwgXzyOReSneVgKovP6tLR8PDRy' WHERE "cardType" = 'Platinum Card';
UPDATE card_balances SET plaid_account_id = 'VeQY1kaRp7t8wvOyRQMrupB4LXan08UJvxZYvY' WHERE "cardType" = 'Bonvoy Business Amex';
UPDATE card_balances SET plaid_account_id = 'ReJYwB07X5tAo6R0OQm3CjDeY4AwaVIra3JoaP' WHERE "cardType" = 'Business Blue Plus II';
UPDATE card_balances SET plaid_account_id = 'MeJVQLy9patQRXZVM0zOfzaV0MQe3Ytg6Y4O6w' WHERE "cardType" = 'Hilton Honors Business';
UPDATE card_balances SET plaid_account_id = 'QeJYdqvypZt5pQzDwerJUa9Oyz5gvVsoVr3MVj' WHERE "cardType" = 'Business White Gold';

-- Update last_synced timestamp for all updated records
UPDATE card_balances SET last_synced = now();