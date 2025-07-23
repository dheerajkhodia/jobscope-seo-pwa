
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SEOHead from '@/components/SEOHead'
import { supabase } from '@/integrations/supabase/client'
import type { BlogPost } from '@/lib/supabase'
import { Calendar, ArrowRight, Search } from 'lucide-react'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_date', { ascending: false })

      if (data) {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.meta_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Job Scope India Blog",
    "description": "Career insights and job market trends in India",
    "url": "https://jobscopeindia.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Job Scope India"
    }
  }

  return (
    <>
      <SEOHead 
        title="Blog - Job Scope India | Career Insights & Job Market Trends"
        description="Read the latest career insights, job market analysis, and professional development tips for India's workforce."
        structuredData={structuredData}
      />

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Career Insights Blog
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Stay ahead in India's dynamic job market with expert insights, trends, and career guidance.
          </p>

          {/* Search */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-border/50">
                <CardContent className="p-4 md:p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="h-5 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="h-9 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Posts */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              {searchTerm ? 'No articles found' : 'No articles published yet'}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {searchTerm 
                ? 'Try different search terms or browse all articles.' 
                : 'Check back soon for insightful career content!'
              }
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline" size="sm">
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{new Date(post.published_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <h2 className="text-lg md:text-xl font-semibold mb-3 line-clamp-2 leading-tight text-foreground">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground line-clamp-3 mb-4 text-sm md:text-base">
                      {post.meta_description}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="w-full h-9">
                      Read Article
                      <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
