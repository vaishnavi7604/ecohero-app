-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create activities table with category-based automatic points
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('recycling', 'afforestation', 'energy_saving', 'eco_transportation', 'sustainable_food', 'water_conservation', 'other')),
  points integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Activities policies
CREATE POLICY "Users can view their own activities"
  ON public.activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON public.activities FOR DELETE
  USING (auth.uid() = user_id);

-- Function to assign points based on category
CREATE OR REPLACE FUNCTION public.get_category_points(category_name text)
RETURNS integer
LANGUAGE plpgsql
STABLE
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

-- Trigger function to auto-assign points on insert
CREATE OR REPLACE FUNCTION public.auto_assign_activity_points()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.points := public.get_category_points(NEW.category);
  RETURN NEW;
END;
$$;

-- Create trigger for auto-assigning points
CREATE TRIGGER assign_activity_points
  BEFORE INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_activity_points();

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();