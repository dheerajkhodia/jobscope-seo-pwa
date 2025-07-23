import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import SEOHead from '@/components/SEOHead'
import ShareButtons from '@/components/ShareButtons'
import { supabase } from '@/integrations/supabase/client'
import type { BlogPost } from '@/lib/supabase'
import { Calendar, ArrowLeft, Clock, Tag } from 'lucide-react'

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-surface-variant rounded-xl w-32"></div>
              <div className="h-8 bg-surface-variant rounded-xl"></div>
              <div className="h-6 bg-surface-variant rounded-xl w-1/3"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-surface-variant rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button className="btn-native">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentUrl = `${window.location.origin}/blog/${post.slug}`
  const readingTime = Math.ceil(post.content.split(' ').length / 200)

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

      <div className="min-h-screen bg-background">
        {/* Header - Clean minimal design */}
        <div className="bg-background border-b border-outline-variant">
          <div className="container mx-auto px-4 py-6">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 btn-native">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            <article className="max-w-4xl mx-auto">
              <header className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(post.published_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{readingTime} min read</span>
                    </div>
                  </div>
                  
                  <div className="sm:ml-auto">
                    <ShareButtons 
                      url={currentUrl}
                      title={post.title}
                      description={post.meta_description}
                    />
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>
            </article>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <div className="prose-mobile">
              {post.content_type === 'markdown' ? (
                <ReactMarkdown>{post.content}</ReactMarkdown>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-outline-variant">
              <div className="bg-surface-variant/50 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Share this article</h3>
                    <ShareButtons 
                      url={currentUrl}
                      title={post.title}
                      description={post.meta_description}
                    />
                  </div>
                  
                  <Link to="/blog">
                    <Button variant="outline" className="btn-native">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      More Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  )
}