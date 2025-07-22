import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import SEOHead from '@/components/SEOHead'
import { supabase, BlogPost } from '@/lib/supabase'
import { LogIn, Plus, Edit, Trash2, Eye } from 'lucide-react'

const ADMIN_PIN = '01460686237'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    content_type: 'markdown' as 'markdown' | 'html',
    seo_title: '',
    meta_description: '',
    focus_keywords: '',
    canonical_url: '',
    og_image_url: '',
    tags: '',
    published_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true)
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!"
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid PIN. Please try again.",
        variant: "destructive"
      })
    }
  }

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false })

    if (data) {
      setPosts(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        seo_title: formData.seo_title || formData.title,
        published_date: formData.published_date + 'T00:00:00.000Z'
      }

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)

        if (error) throw error

        toast({
          title: "Post Updated",
          description: "Blog post has been updated successfully!"
        })
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(postData)

        if (error) throw error

        toast({
          title: "Post Created",
          description: "Blog post has been created successfully!"
        })
      }

      resetForm()
      fetchPosts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      content_type: post.content_type,
      seo_title: post.seo_title,
      meta_description: post.meta_description,
      focus_keywords: post.focus_keywords,
      canonical_url: post.canonical_url || '',
      og_image_url: post.og_image_url || '',
      tags: post.tags.join(', '),
      published_date: post.published_date.split('T')[0]
    })
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Post Deleted",
        description: "Blog post has been deleted successfully!"
      })
      fetchPosts()
    }
  }

  const resetForm = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      content_type: 'markdown',
      seo_title: '',
      meta_description: '',
      focus_keywords: '',
      canonical_url: '',
      og_image_url: '',
      tags: '',
      published_date: new Date().toISOString().split('T')[0]
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead title="Admin Login - Job Scope India" />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pin">Enter PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter admin PIN"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead title="Admin Panel - Job Scope India" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">
              {editingPost ? 'Edit Post' : 'Create Post'}
            </TabsTrigger>
            <TabsTrigger value="manage">Manage Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {editingPost ? <Edit className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Blog Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value })
                          if (!formData.slug || formData.slug === generateSlug(formData.title)) {
                            setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                          }
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Content Type */}
                  <div>
                    <Label htmlFor="content_type">Content Type</Label>
                    <Select value={formData.content_type} onValueChange={(value: 'markdown' | 'html') => setFormData({ ...formData, content_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="html">Raw HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="content">Blog Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={15}
                      className="font-mono"
                      required
                    />
                  </div>

                  {/* SEO Fields */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">SEO Settings</h3>
                    
                    <div>
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input
                        id="seo_title"
                        value={formData.seo_title}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                        placeholder="Leave empty to use blog title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="meta_description">Meta Description *</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="focus_keywords">Focus Keywords (comma-separated) *</Label>
                      <Input
                        id="focus_keywords"
                        value={formData.focus_keywords}
                        onChange={(e) => setFormData({ ...formData, focus_keywords: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="canonical_url">Canonical URL</Label>
                        <Input
                          id="canonical_url"
                          value={formData.canonical_url}
                          onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                          placeholder="https://jobscopeindia.com/blog/post-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="og_image_url">OG Image URL</Label>
                        <Input
                          id="og_image_url"
                          value={formData.og_image_url}
                          onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Publishing */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Publishing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="career, jobs, india, technology"
                        />
                      </div>
                      <div>
                        <Label htmlFor="published_date">Publish Date</Label>
                        <Input
                          id="published_date"
                          type="date"
                          value={formData.published_date}
                          onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                    </Button>
                    {editingPost && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts ({posts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No posts created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.published_date).toLocaleDateString()} • /{post.slug}
                          </p>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}