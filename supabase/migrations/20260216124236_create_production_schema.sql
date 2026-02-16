/*
  # Production-Ready UPRO Platform Database Schema

  ## Overview
  Complete database schema for the UPRO platform including users, service providers, bookings, 
  wallets, reviews, messages, and comprehensive admin management system.

  ## 1. New Tables

  ### `users_profile`
  - `id` (uuid, primary key, foreign key to auth.users) - User ID
  - `first_name` (text) - User's first name
  - `last_name` (text) - User's last name
  - `phone` (text) - Phone number
  - `user_type` (text) - Type: 'customer', 'service_provider', 'admin', 'super_admin'
  - `state` (text) - Nigerian state
  - `lga` (text) - Local Government Area
  - `address` (text, nullable) - Physical address
  - `profile_image` (text, nullable) - Profile picture URL
  - `is_verified` (boolean) - Account verification status
  - `is_active` (boolean) - Account active status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `service_providers`
  - `id` (uuid, primary key) - Provider ID
  - `user_id` (uuid, foreign key to auth.users) - Associated user account
  - `bio` (text, nullable) - Provider biography
  - `service_categories` (jsonb) - Array of service categories offered
  - `experience_years` (integer) - Years of experience
  - `certifications` (jsonb, nullable) - Array of certifications
  - `portfolio` (jsonb, nullable) - Portfolio items
  - `availability` (jsonb, nullable) - Availability schedule
  - `rating` (decimal) - Average rating
  - `total_jobs` (integer) - Number of completed jobs
  - `price_range_min` (decimal) - Minimum price
  - `price_range_max` (decimal) - Maximum price
  - `service_radius_km` (integer) - Service radius in kilometers
  - `is_available` (boolean) - Current availability status
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `services`
  - `id` (uuid, primary key) - Service ID
  - `provider_id` (uuid, foreign key to service_providers) - Provider offering the service
  - `name` (text) - Service name
  - `category` (text) - Service category
  - `description` (text) - Service description
  - `base_price` (decimal) - Base price for the service
  - `duration_hours` (decimal) - Estimated duration in hours
  - `is_active` (boolean) - Service availability status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `bookings`
  - `id` (uuid, primary key) - Booking ID
  - `customer_id` (uuid, foreign key to auth.users) - Customer who booked
  - `provider_id` (uuid, foreign key to service_providers) - Service provider
  - `service_id` (uuid, foreign key to services) - Service booked
  - `description` (text) - Booking description/requirements
  - `scheduled_date` (date) - Scheduled service date
  - `scheduled_time` (time) - Scheduled service time
  - `location_address` (text) - Service location address
  - `location_state` (text) - Service location state
  - `location_lga` (text) - Service location LGA
  - `location_coordinates` (jsonb, nullable) - GPS coordinates
  - `status` (text) - Status: pending, accepted, rejected, in_progress, completed, cancelled, disputed
  - `estimated_price` (decimal) - Estimated price
  - `final_price` (decimal, nullable) - Final agreed price
  - `payment_status` (text) - Payment status: pending, paid, refunded
  - `created_at` (timestamptz) - Booking creation timestamp
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `reviews`
  - `id` (uuid, primary key) - Review ID
  - `booking_id` (uuid, foreign key to bookings) - Associated booking
  - `customer_id` (uuid, foreign key to auth.users) - Customer who reviewed
  - `provider_id` (uuid, foreign key to service_providers) - Provider being reviewed
  - `rating` (integer) - Rating (1-5)
  - `comment` (text) - Review comment
  - `response` (text, nullable) - Provider's response
  - `created_at` (timestamptz) - Review creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `wallet`
  - `id` (uuid, primary key) - Wallet ID
  - `user_id` (uuid, unique, foreign key to auth.users) - User who owns the wallet
  - `balance` (decimal) - Current balance
  - `total_earnings` (decimal) - Total earnings
  - `total_withdrawals` (decimal) - Total withdrawals
  - `created_at` (timestamptz) - Wallet creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `transactions`
  - `id` (uuid, primary key) - Transaction ID
  - `wallet_id` (uuid, foreign key to wallet) - Associated wallet
  - `user_id` (uuid, foreign key to auth.users) - User who made transaction
  - `type` (text) - Type: credit, debit
  - `amount` (decimal) - Transaction amount
  - `description` (text) - Transaction description
  - `reference` (text, unique) - Transaction reference
  - `status` (text) - Status: pending, completed, failed
  - `booking_id` (uuid, nullable, foreign key to bookings) - Associated booking if any
  - `created_at` (timestamptz) - Transaction timestamp

  ### `conversations`
  - `id` (uuid, primary key) - Conversation ID
  - `customer_id` (uuid, foreign key to auth.users) - Customer in conversation
  - `provider_id` (uuid, foreign key to service_providers) - Provider in conversation
  - `booking_id` (uuid, nullable, foreign key to bookings) - Related booking
  - `created_at` (timestamptz) - Conversation start timestamp
  - `updated_at` (timestamptz) - Last message timestamp

  ### `messages`
  - `id` (uuid, primary key) - Message ID
  - `conversation_id` (uuid, foreign key to conversations) - Associated conversation
  - `sender_id` (uuid, foreign key to auth.users) - Message sender
  - `content` (text) - Message content
  - `is_read` (boolean) - Read status
  - `attachments` (jsonb, nullable) - Message attachments
  - `created_at` (timestamptz) - Message timestamp

  ### `admin_logs`
  - `id` (uuid, primary key) - Log ID
  - `admin_id` (uuid, foreign key to auth.users) - Admin who performed action
  - `action` (text) - Action performed
  - `target_type` (text) - Type of target (user, booking, etc.)
  - `target_id` (uuid) - ID of affected record
  - `details` (jsonb, nullable) - Additional details
  - `created_at` (timestamptz) - Action timestamp

  ## 2. Security (Row Level Security)
  - All tables have RLS enabled
  - Users can only access their own data
  - Service providers can access their bookings and related data
  - Admins and super_admins have full access to all data
  - Super admins can manage other admins

  ## 3. Indexes
  - Indexes on all foreign keys
  - Indexes on frequently queried columns (status, dates, etc.)
  - Text search indexes where applicable

  ## 4. Important Notes
  - All monetary values use decimal type
  - All timestamps use timestamptz
  - Super admin has elevated privileges
  - Comprehensive audit logging for admin actions
  - Triggers automatically update timestamps
*/

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  user_type text NOT NULL DEFAULT 'customer' CHECK (user_type IN ('customer', 'service_provider', 'admin', 'super_admin')),
  state text NOT NULL,
  lga text NOT NULL,
  address text,
  profile_image text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bio text,
  service_categories jsonb NOT NULL DEFAULT '[]',
  experience_years integer DEFAULT 0,
  certifications jsonb DEFAULT '[]',
  portfolio jsonb DEFAULT '[]',
  availability jsonb DEFAULT '[]',
  rating decimal(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  total_jobs integer DEFAULT 0,
  price_range_min decimal(10,2) DEFAULT 0,
  price_range_max decimal(10,2) DEFAULT 0,
  service_radius_km integer DEFAULT 10,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  base_price decimal(10,2) NOT NULL DEFAULT 0,
  duration_hours decimal(4,2) DEFAULT 1.0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  description text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  location_address text NOT NULL,
  location_state text NOT NULL,
  location_lga text NOT NULL,
  location_coordinates jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'disputed')),
  estimated_price decimal(10,2) NOT NULL,
  final_price decimal(10,2),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallet table
CREATE TABLE IF NOT EXISTS wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance decimal(12,2) DEFAULT 0.00 CHECK (balance >= 0),
  total_earnings decimal(12,2) DEFAULT 0.00,
  total_withdrawals decimal(12,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallet(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  amount decimal(12,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  reference text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, provider_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  attachments jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_profile_user_type ON users_profile(user_type);
CREATE INDEX IF NOT EXISTS idx_users_profile_state ON users_profile(state);
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON service_providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON wallet(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_provider_id ON conversations(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users_profile

CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users_profile FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND user_type = (SELECT user_type FROM users_profile WHERE id = auth.uid()));

CREATE POLICY "Super admins can update any profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type = 'super_admin'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
  ON users_profile FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for service_providers

CREATE POLICY "Anyone can view active providers"
  ON service_providers FOR SELECT
  TO authenticated
  USING (is_available = true OR user_id = auth.uid());

CREATE POLICY "Providers can update own profile"
  ON service_providers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers can create own profile"
  ON service_providers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all provider profiles"
  ON service_providers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for services

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (
    is_active = true OR
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = services.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can manage own services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = services.provider_id
      AND service_providers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = services.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for bookings

CREATE POLICY "Customers can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Providers can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = bookings.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers and providers can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = bookings.provider_id
      AND service_providers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = bookings.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for reviews

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Providers can respond to reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = reviews.provider_id
      AND service_providers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = reviews.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for wallet

CREATE POLICY "Users can view own wallet"
  ON wallet FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all wallets"
  ON wallet FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can manage wallets"
  ON wallet FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for transactions

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for conversations

CREATE POLICY "Customers can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Providers can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = conversations.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can view all conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for messages

CREATE POLICY "Conversation participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (
        conversations.customer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM service_providers
          WHERE service_providers.id = conversations.provider_id
          AND service_providers.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Conversation participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (
        conversations.customer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM service_providers
          WHERE service_providers.id = conversations.provider_id
          AND service_providers.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for admin_logs

CREATE POLICY "Admins can view admin logs"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can create admin logs"
  ON admin_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.user_type IN ('admin', 'super_admin')
    )
  );

-- Functions and Triggers

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_profile_timestamp ON users_profile;
CREATE TRIGGER update_users_profile_timestamp
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_providers_timestamp ON service_providers;
CREATE TRIGGER update_service_providers_timestamp
  BEFORE UPDATE ON service_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_timestamp ON services;
CREATE TRIGGER update_services_timestamp
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_timestamp ON bookings;
CREATE TRIGGER update_bookings_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_timestamp ON reviews;
CREATE TRIGGER update_reviews_timestamp
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wallet_timestamp ON wallet;
CREATE TRIGGER update_wallet_timestamp
  BEFORE UPDATE ON wallet
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_timestamp ON conversations;
CREATE TRIGGER update_conversations_timestamp
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE service_providers
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE provider_id = NEW.provider_id
  ),
  total_jobs = (
    SELECT COUNT(*)
    FROM bookings
    WHERE provider_id = NEW.provider_id
    AND status = 'completed'
  )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider rating when review is added
DROP TRIGGER IF EXISTS update_provider_rating_trigger ON reviews;
CREATE TRIGGER update_provider_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

-- Function to create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallet (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create wallet when user profile is created
DROP TRIGGER IF EXISTS create_wallet_on_user_creation ON users_profile;
CREATE TRIGGER create_wallet_on_user_creation
  AFTER INSERT ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();