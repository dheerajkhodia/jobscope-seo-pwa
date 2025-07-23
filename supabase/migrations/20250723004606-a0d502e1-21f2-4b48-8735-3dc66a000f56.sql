-- Create blog_posts table for the blogging functionality
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('markdown', 'html')) DEFAULT 'markdown',
  seo_title TEXT,
  meta_description TEXT NOT NULL,
  focus_keywords TEXT NOT NULL,
  canonical_url TEXT,
  og_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read blog posts (public blog)
CREATE POLICY "Blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- Create policy to allow insert/update/delete for authenticated users only
-- Note: Since there's no authentication implemented yet, we'll use a simple policy
-- This should be updated when authentication is added
CREATE POLICY "Blog posts can be managed by authenticated users" 
ON public.blog_posts 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();