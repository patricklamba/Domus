/*
  # Initial Schema for Domus Angola

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone_number` (text)
      - `role` (enum: employer, cleaner)
      - `avatar_url` (text)
      - `location` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `cleaner_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `age` (integer)
      - `experience_years` (integer)
      - `hourly_rate` (integer)
      - `bio` (text)
      - `services` (text array)
      - `is_available` (boolean)
      - `rating` (decimal)
      - `total_jobs` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `job_requests`
      - `id` (uuid, primary key)
      - `employer_id` (uuid, references profiles)
      - `cleaner_id` (uuid, references profiles, nullable)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `start_date` (date)
      - `start_time` (time)
      - `duration_days` (integer)
      - `price_per_day` (integer)
      - `total_price` (integer)
      - `status` (enum: pending, accepted, in_progress, completed, cancelled)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `job_id` (uuid, references job_requests)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('employer', 'cleaner');
CREATE TYPE job_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  role user_role NOT NULL,
  avatar_url text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cleaner_profiles table
CREATE TABLE IF NOT EXISTS cleaner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  age integer,
  experience_years integer,
  hourly_rate integer,
  bio text,
  services text[],
  is_available boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 0.0,
  total_jobs integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_requests table
CREATE TABLE IF NOT EXISTS job_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  cleaner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  location text NOT NULL,
  start_date date NOT NULL,
  start_time time NOT NULL,
  duration_days integer NOT NULL,
  price_per_day integer NOT NULL,
  total_price integer NOT NULL,
  status job_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES job_requests(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Public read access for cleaner profiles (for search)
CREATE POLICY "Anyone can read cleaner profiles"
  ON cleaner_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cleaners can manage own profile"
  ON cleaner_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Job requests policies
CREATE POLICY "Employers can manage own job requests"
  ON job_requests
  FOR ALL
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "Cleaners can read job requests"
  ON job_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cleaners can update assigned jobs"
  ON job_requests
  FOR UPDATE
  TO authenticated
  USING (cleaner_id = auth.uid());

-- Reviews policies
CREATE POLICY "Users can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their jobs"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_available ON cleaner_profiles(is_available);
CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_rating ON cleaner_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_requests_employer ON job_requests(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_cleaner ON job_requests(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cleaner_profiles_updated_at
  BEFORE UPDATE ON cleaner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_requests_updated_at
  BEFORE UPDATE ON job_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();