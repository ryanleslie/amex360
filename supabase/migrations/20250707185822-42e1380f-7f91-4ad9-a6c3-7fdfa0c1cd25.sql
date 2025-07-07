-- Add plaid_account_id and last_updated columns to card_balances table
ALTER TABLE public.card_balances 
ADD COLUMN plaid_account_id TEXT,
ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records with plaid_account_id values based on primary cards mapping
UPDATE public.card_balances 
SET plaid_account_id = CASE 
  WHEN cardType = 'Business Platinum Card' THEN '3oLQqMrV4RhE5dnmEVOdHbXr41LpZAH04DXdA'
  WHEN cardType = 'Platinum Card' THEN 'qLBXx7mDM1sXawREXgPwupAKrvg1DEIr3NR4D'
  WHEN cardType = 'Charles Schwab Platinum Card' THEN 'BD49VvMpqyhMg4vzMpP4UXEDz4mMN9IjJ4m5v'
  WHEN cardType = 'Business Blue Plus II' THEN 'DP8rYjdo3kcJz0xgJZ80tr3bxmj8gNUqBYedo'
  WHEN cardType = 'Business Blue Plus I' THEN 'zkrOLDxAMXsPnpBaP10pfBbn0jgxvYCByA7Yy'
  WHEN cardType = 'Delta SkyMiles® Reserve' THEN 'Lv8DJ5BorEumZgnJmD6gUb0eAVDk8dHPro57v'
  WHEN cardType = 'Hilton Honors Business' THEN '6oPRy6xVJrhqZN0OqQbNH9nD3PY7MjF910nK4'
  WHEN cardType = 'Amazon Business Prime' THEN 'w3vAdwryMKtp1mzXp6kmu4vLEb51K6IMpd7X7'
  WHEN cardType = 'Bonvoy Business Amex' THEN 'dvnD90M5pxupbJaxpB8JuYdy6J9KoAt1J0Apz'
  WHEN cardType = 'Business Green' THEN 'yKjO6LakMXSPeEnNPDvEfX1gPqb6pzIodXwY3'
  WHEN cardType = 'Business Classic Gold' THEN 'P4mBb7koJjsMowXqM46wU5m18EvoJkC74wLjm'
  WHEN cardType = 'Business White Gold' THEN '1owQ1V0Ej4h6bzyE6oxzsBoOp7AkRKCqLb5Db'
  WHEN cardType = 'Business Rose Gold' THEN 'mZDA45qdEwTRBV0DR86Vivy3D07oBmF4kraYw'
END;