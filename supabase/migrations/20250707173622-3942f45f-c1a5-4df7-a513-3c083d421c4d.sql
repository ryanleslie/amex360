-- Create plaid_items table
CREATE TABLE public.plaid_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plaid_item_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  institution_id TEXT NULL,
  institution_name TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT plaid_items_pkey PRIMARY KEY (id),
  CONSTRAINT plaid_items_plaid_item_id_key UNIQUE (plaid_item_id),
  CONSTRAINT plaid_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own plaid items" 
ON public.plaid_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaid items" 
ON public.plaid_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plaid items" 
ON public.plaid_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plaid items" 
ON public.plaid_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_plaid_items_updated_at
    BEFORE UPDATE ON public.plaid_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();