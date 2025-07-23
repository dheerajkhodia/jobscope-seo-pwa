import { Button } from '@/components/ui/button'
import { MessageCircle, Send, Share2 } from 'lucide-react'

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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        })
      } catch (err) {
        // Fallback to WhatsApp if native share fails
        shareToWhatsApp()
      }
    } else {
      // Fallback for browsers without native share
      shareToWhatsApp()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Native Share (mobile-first) */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="btn-native flex items-center gap-2 md:hidden"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>

      {/* Desktop/Tablet specific buttons */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareToWhatsApp}
          className="btn-native flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareToTelegram}
          className="btn-native flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          <span>Telegram</span>
        </Button>
      </div>
    </div>
  )
}