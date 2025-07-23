import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SEOHead from '@/components/SEOHead'
import { ArrowRight, TrendingUp, Users, Award, BookOpen, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { BlogPost } from '@/lib/supabase'

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(3)

      if (data) {
        setLatestPosts(data)
      }
    }

    fetchLatestPosts()
  }, [])

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Job Scope India",
    "description": "Career insights and job market trends in India",
    "url": "https://jobscopeindia.com",
    "publisher": {
      "@type": "Organization",
      "name": "Job Scope India"
    }
  }

  return (
    <>
      <SEOHead structuredData={structuredData} />
      
      {/* Hero Section - Mobile Native */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Career Growth Platform</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Navigate Your Career in
              <span className="block text-accent-foreground bg-accent/20 backdrop-blur-sm rounded-2xl px-4 py-2 mt-2 inline-block">
                India's Job Market
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-2xl mx-auto">
              Get expert insights, latest trends, and career guidance to accelerate your professional growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-native px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                  Explore Insights
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 btn-native px-8 py-4 text-lg font-semibold w-full sm:w-auto backdrop-blur-sm"
              >
                Latest Trends
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose Job Scope India?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive career insights for India's job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-native hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Market Trends</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Stay updated with job market trends, salary insights, and industry forecasts across India.
                </p>
              </CardContent>
            </Card>

            <Card className="card-native hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Career Guidance</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Expert advice on career transitions, skill development, and professional growth strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="card-native hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Industry Insights</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Deep dive into industries, emerging roles, and high-demand skills in India's market.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts - Mobile Optimized */}
      {latestPosts.length > 0 && (
        <section className="py-16 bg-surface-variant/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Latest Insights
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fresh perspectives on India's evolving job landscape
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <Card key={post.id} className="card-native hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{new Date(post.published_date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-foreground leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {post.meta_description}
                      </p>
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

            <div className="text-center mt-12">
              <Link to="/blog">
                <Button size="lg" className="btn-native px-8 py-4">
                  View All Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Mobile Native */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Advance Your Career?
            </h2>
            <p className="text-lg mb-8 text-white/90 leading-relaxed">
              Join thousands of professionals who trust Job Scope India for career insights and market intelligence.
            </p>
            <Link to="/blog">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-native px-8 py-4 text-lg font-semibold">
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}