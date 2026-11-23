import { SITE } from '../data/site.js';
import { formatPrice } from './utils.js';

/** The WhatsApp order text. `details` (optional) comes from the checkout form. */
export function orderMessage(items, total, details) {
  const lines = items.map((i) => `• ${i.name} × ${i.qty} – ${formatPrice(i.price * i.qty)}`);
  const out = [`Hello ${SITE.name}! I'd like to order:`, '', ...lines, '', `Subtotal: ${formatPrice(total)}`];
  if (details) {
    out.push('', 'My details:');
    if (details.name) out.push(`Name: ${details.name}`);
    if (details.phone) out.push(`Phone: ${details.phone}`);
    if (details.email) out.push(`Email: ${details.email}`);
    const addr = [details.address, details.city, details.state, details.pin].filter(Boolean).join(', ');
    if (addr) out.push(`Delivery address: ${addr}`);
    if (details.note) out.push(`Note: ${details.note}`);
  }
  return out.join('\n');
}
