-- Fix search_path for security - proper order
DROP TRIGGER IF EXISTS assign_activity_points ON public.activities;
DROP FUNCTION IF EXISTS public.auto_assign_activity_points();
DROP FUNCTION IF EXISTS public.get_category_points(text);

-- Recreate get_category_points with proper search_path
CREATE OR REPLACE FUNCTION public.get_category_points(category_name text)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CASE category_name
    WHEN 'recycling' THEN 10
    WHEN 'afforestation' THEN 25
    WHEN 'energy_saving' THEN 15
    WHEN 'eco_transportation' THEN 20
    WHEN 'sustainable_food' THEN 12
    WHEN 'water_conservation' THEN 18
    WHEN 'other' THEN 5
    ELSE 0
  END;
END;
$$;

-- Recreate auto_assign_activity_points with proper search_path
CREATE OR REPLACE FUNCTION public.auto_assign_activity_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.points := public.get_category_points(NEW.category);
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER assign_activity_points
  BEFORE INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_activity_points();