-- Create waitlist signups table
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  language TEXT,
  is_organizer BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'CivicLink Waitlist',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for public insertion (waitlist signup)
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist_signups 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing (admin only - no public access)
CREATE POLICY "No public access to waitlist data" 
ON public.waitlist_signups 
FOR SELECT 
USING (false);

-- Create index for email lookups
CREATE INDEX idx_waitlist_signups_email ON public.waitlist_signups(email);
CREATE INDEX idx_waitlist_signups_created_at ON public.waitlist_signups(created_at);