import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import SEOHead from '@/components/SEOHead'
import ShareButtons from '@/components/ShareButtons'
import { supabase } from '@/integrations/supabase/client'
import type { BlogPost } from '@/lib/supabase'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        setError('Post not found')
      } else {
        setPost(data)
      }
      setLoading(false)
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentUrl = `${window.location.origin}/blog/${post.slug}`
  const readingTime = Math.ceil(post.content.split(' ').length / 200) // Approximate reading time

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description,
    "image": post.og_image_url || "/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": "Job Scope India"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Job Scope India",
      "logo": {
        "@type": "ImageObject",
        "url": "/icon-192.png"
      }
    },
    "datePublished": post.published_date,
    "dateModified": post.updated_at,
    "url": currentUrl,
    "keywords": post.focus_keywords
  }

  return (
    <>
      <SEOHead
        title={post.seo_title || post.title}
        description={post.meta_description}
        keywords={post.focus_keywords}
        canonicalUrl={post.canonical_url || currentUrl}
        ogImage={post.og_image_url}
        structuredData={structuredData}
      />

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary-glow transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.published_date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <ShareButtons 
                url={currentUrl}
                title={post.title}
                description={post.meta_description}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose-blog">
            {post.content_type === 'markdown' ? (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Share this article</h3>
                <ShareButtons 
                  url={currentUrl}
                  title={post.title}
                  description={post.meta_description}
                />
              </div>
              
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}