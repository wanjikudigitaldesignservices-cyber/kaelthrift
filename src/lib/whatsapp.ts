// ============================================================
// WhatsApp Deep Link Utilities
// ============================================================

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254740396075';

/**
 * Generate a WhatsApp deep link for ordering a specific product.
 */
export function getOrderWhatsAppLink(
  productName: string,
  price: number,
  productUrl: string
): string {
  const message = `Hi KaelThrift, I want to order:\n\n📦 *${productName}*\n💰 KES ${price.toLocaleString()}\n🔗 ${productUrl}\n\nPlease confirm availability and delivery details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp deep link for general inquiries.
 */
export function getGeneralWhatsAppLink(): string {
  const message = 'Hi KaelThrift! I have a question about your items.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Format price in Kenyan Shillings.
 */
export function formatKES(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}
