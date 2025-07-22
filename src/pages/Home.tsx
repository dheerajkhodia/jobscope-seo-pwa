import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SEOHead from '@/components/SEOHead'
import { ArrowRight, TrendingUp, Users, Award, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase, BlogPost } from '@/lib/supabase'

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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Navigate Your Career Journey in 
              <span className="block text-accent"> India</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Get expert insights, latest job market trends, and career guidance 
              to accelerate your professional growth in India's dynamic job market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg">
                  Explore Insights
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Latest Trends
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Job Scope India?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive career insights tailored for the Indian job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Market Trends</h3>
                <p className="text-muted-foreground">
                  Stay updated with the latest job market trends, salary insights, and industry forecasts across various sectors in India.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Career Guidance</h3>
                <p className="text-muted-foreground">
                  Get expert advice on career transitions, skill development, and professional growth strategies tailored for Indian professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Industry Insights</h3>
                <p className="text-muted-foreground">
                  Deep dive into specific industries, emerging roles, and the skills that are in high demand in India's job market.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Insights
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Fresh perspectives on India's evolving job landscape
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                        <BookOpen className="h-4 w-4" />
                        <span>{new Date(post.published_date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">{post.meta_description}</p>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/blog">
                <Button size="lg" className="px-8">
                  View All Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of professionals who trust Job Scope India for their career insights and job market intelligence.
          </p>
          <Link to="/blog">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}