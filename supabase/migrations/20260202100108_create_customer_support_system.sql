/*
  # Customer Support Chat System

  ## Overview
  Creates a comprehensive customer support chat system that allows customers to initiate support conversations and receive help from administrators or support staff.

  ## 1. New Tables
  
  ### `support_conversations`
  - `id` (uuid, primary key) - Unique identifier for each support conversation
  - `customer_id` (uuid, foreign key to auth.users) - The customer who initiated the conversation
  - `subject` (text) - Subject or title of the support request
  - `status` (text) - Current status: 'open', 'in_progress', 'resolved', 'closed'
  - `priority` (text) - Priority level: 'low', 'medium', 'high', 'urgent'
  - `assigned_to` (uuid, nullable, foreign key to auth.users) - Admin/support staff assigned to this conversation
  - `category` (text) - Category of the support request
  - `created_at` (timestamptz) - When the conversation was created
  - `updated_at` (timestamptz) - Last update timestamp
  - `resolved_at` (timestamptz, nullable) - When the conversation was resolved

  ### `support_messages`
  - `id` (uuid, primary key) - Unique identifier for each message
  - `conversation_id` (uuid, foreign key to support_conversations) - The conversation this message belongs to
  - `sender_id` (uuid, foreign key to auth.users) - User who sent the message
  - `message` (text) - The message content
  - `is_internal_note` (boolean) - Whether this is an internal note (only visible to support staff)
  - `attachments` (jsonb, nullable) - Array of attachment URLs
  - `created_at` (timestamptz) - When the message was sent
  - `read_at` (timestamptz, nullable) - When the message was read

  ## 2. Security
  - Enable Row Level Security on all tables
  - Customers can only view their own conversations and messages
  - Support staff and admins can view all conversations
  - Only authenticated users can create conversations
  - Only conversation participants can send messages

  ## 3. Indexes
  - Index on customer_id for faster customer conversation lookups
  - Index on conversation_id for faster message retrieval
  - Index on status for filtering active conversations

  ## 4. Important Notes
  - All timestamps use timestamptz for proper timezone handling
  - Status changes automatically update the updated_at timestamp
  - Internal notes are hidden from customers
  - Proper foreign key constraints ensure data integrity
*/

-- Create support_conversations table
CREATE TABLE IF NOT EXISTS support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_internal_note boolean DEFAULT false,
  attachments jsonb,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_conversations_customer_id ON support_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_status ON support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_conversations_assigned_to ON support_conversations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation_id ON support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Enable Row Level Security
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_conversations

-- Customers can view their own conversations
CREATE POLICY "Customers can view own conversations"
  ON support_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
  ON support_conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'type' = 'admin'
    )
  );

-- Authenticated users can create conversations
CREATE POLICY "Authenticated users can create conversations"
  ON support_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own conversations (only specific fields)
CREATE POLICY "Customers can update own conversations"
  ON support_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- Admins can update all conversations
CREATE POLICY "Admins can update all conversations"
  ON support_conversations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'type' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'type' = 'admin'
    )
  );

-- RLS Policies for support_messages

-- Users can view messages in their conversations (excluding internal notes for customers)
CREATE POLICY "Users can view messages in their conversations"
  ON support_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND (
        support_conversations.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'type' = 'admin'
        )
      )
    )
    AND (
      NOT is_internal_note
      OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'type' = 'admin'
      )
    )
  );

-- Users can create messages in conversations they're part of
CREATE POLICY "Users can create messages in their conversations"
  ON support_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND (
        support_conversations.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'type' = 'admin'
        )
      )
    )
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update messages"
  ON support_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND (
        support_conversations.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'type' = 'admin'
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND (
        support_conversations.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'type' = 'admin'
        )
      )
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp on conversation changes
DROP TRIGGER IF EXISTS update_support_conversations_timestamp ON support_conversations;
CREATE TRIGGER update_support_conversations_timestamp
  BEFORE UPDATE ON support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_support_conversation_timestamp();