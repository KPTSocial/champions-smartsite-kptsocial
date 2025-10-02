-- Fix security warning: Set search_path for function
DROP FUNCTION IF EXISTS public.activate_scheduled_menu_items();

CREATE OR REPLACE FUNCTION public.activate_scheduled_menu_items()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Activate items that should start today or have already started
  UPDATE public.menu_items
  SET is_available = true
  WHERE special_start_date <= CURRENT_DATE
    AND is_available = false
    AND is_special = true;
    
  -- Deactivate items that expired yesterday or earlier
  UPDATE public.menu_items
  SET is_available = false
  WHERE special_end_date < CURRENT_DATE
    AND is_available = true
    AND is_special = true;
END;
$$;