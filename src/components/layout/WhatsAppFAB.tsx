import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent, EVENTS } from '@/lib/analytics';

export default function WhatsAppFAB() {
  const handleClick = () => {
    trackEvent(EVENTS.WHATSAPP_INQUIRY_CLICK);
  };

  return (
    <a
      href={getGeneralWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
