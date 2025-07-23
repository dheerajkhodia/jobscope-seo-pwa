import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, BookOpen, User, Menu } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant safe-area-top">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">JSI</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">Job Scope India</span>
            <span className="font-bold text-lg text-foreground sm:hidden">JSI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className="btn-native"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/blog">
              <Button
                variant={isActive('/blog') ? 'default' : 'ghost'}
                size="sm"
                className="btn-native"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Blog
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={isActive('/admin') ? 'default' : 'ghost'}
                size="sm"
                className="btn-native"
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden btn-native p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-outline-variant animate-slide-up">
            <div className="container py-4 space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start btn-native"
                >
                  <Home className="h-4 w-4 mr-3" />
                  Home
                </Button>
              </Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/blog') ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start btn-native"
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Blog
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start btn-native"
                >
                  <User className="h-4 w-4 mr-3" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile-First Footer */}
      <footer className="bg-muted/30 border-t border-outline-variant safe-area-bottom">
        <div className="container py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">JSI</span>
              </div>
              <span className="font-bold text-lg">Job Scope India</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your trusted source for career insights and job market trends in India.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-outline-variant">
              <p>&copy; 2024 Job Scope India. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}