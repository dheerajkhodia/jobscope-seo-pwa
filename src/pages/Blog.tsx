import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SEOHead from '@/components/SEOHead'
import { supabase } from '@/integrations/supabase/client'
import type { BlogPost } from '@/lib/supabase'
import { Calendar, ArrowRight, Search, Filter, X } from 'lucide-react'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.meta_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).slice(0, 8)

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

      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-outline-variant">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Career Insights Blog
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Stay ahead in India's dynamic job market with expert insights and trends.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-native pl-12 h-12 text-base"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Filter by topic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? 'default' : 'outline'}
                  size="sm"
                  className="btn-native rounded-full"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    className="btn-native rounded-full"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-native animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-surface-variant rounded-full w-1/3 mb-4"></div>
                    <div className="h-6 bg-surface-variant rounded-lg mb-3"></div>
                    <div className="h-4 bg-surface-variant rounded-lg mb-2"></div>
                    <div className="h-4 bg-surface-variant rounded-lg w-2/3 mb-6"></div>
                    <div className="h-10 bg-surface-variant rounded-xl"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Posts */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {searchTerm || selectedTag ? 'No articles found' : 'No articles published yet'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || selectedTag 
                  ? 'Try different search terms or browse all articles.' 
                  : 'Check back soon for insightful career content!'
                }
              </p>
              {(searchTerm || selectedTag) && (
                <div className="flex gap-3 justify-center">
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm('')} variant="outline" className="btn-native">
                      Clear Search
                    </Button>
                  )}
                  {selectedTag && (
                    <Button onClick={() => setSelectedTag(null)} variant="outline" className="btn-native">
                      Clear Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && filteredPosts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <Card key={post.id} className="card-native hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.published_date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                        
                        <h2 className="text-lg font-semibold mb-3 line-clamp-2 leading-tight text-foreground">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
                          {post.meta_description}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="w-full btn-native justify-between p-3 hover:bg-primary/5">
                          <span className="font-medium">Read Article</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}