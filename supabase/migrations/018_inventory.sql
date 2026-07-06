-- Add stock_quantity to products
ALTER TABLE public.products
ADD COLUMN stock_quantity integer NOT NULL DEFAULT 10;

-- Add a function to atomically decrement stock during checkout
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS boolean AS $$
DECLARE
  current_stock integer;
BEGIN
  SELECT stock_quantity INTO current_stock
  FROM public.products
  WHERE id = product_id
  FOR UPDATE;

  IF current_stock >= quantity THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity - quantity,
        updated_at = now()
    WHERE id = product_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
