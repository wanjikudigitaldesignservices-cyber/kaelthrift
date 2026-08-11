import { supabase } from './supabase';

/**
 * Track a lightweight analytics event (no PII).
 * Fails silently — analytics should never block UX.
 */
export async function trackEvent(
  eventType: string,
  productId?: string
): Promise<void> {
  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      product_id: productId || null,
    });
  } catch {
    // Fail silently — analytics should not disrupt user experience
    console.warn('Analytics event failed:', eventType);
  }
}

// Event type constants
export const EVENTS = {
  WHATSAPP_ORDER_CLICK: 'whatsapp_order_click',
  WHATSAPP_INQUIRY_CLICK: 'whatsapp_inquiry_click',
  PRODUCT_VIEW: 'product_view',
  SHOP_FILTER_USED: 'shop_filter_used',
} as const;
