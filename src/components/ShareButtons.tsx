import { Button } from '@/components/ui/button'
import { MessageCircle, Send } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const shareText = description ? `${title} - ${description}` : title
  
  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`
    window.open(whatsappUrl, '_blank')
  }

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`
    window.open(telegramUrl, '_blank')
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToWhatsApp}
        className="flex items-center space-x-2"
      >
        <MessageCircle className="h-4 w-4" />
        <span>WhatsApp</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToTelegram}
        className="flex items-center space-x-2"
      >
        <Send className="h-4 w-4" />
        <span>Telegram</span>
      </Button>
    </div>
  )
}