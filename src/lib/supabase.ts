// This file only contains types now - the actual client is in /integrations/supabase/client.ts
import type { Tables } from '@/integrations/supabase/types'

export type BlogPost = Tables<'blog_posts'>