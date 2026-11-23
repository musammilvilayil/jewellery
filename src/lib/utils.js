/** ₹1,499 style prices */
export const formatPrice = (amount) => '₹' + amount.toLocaleString('en-IN');

export const savingPercent = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

/** Files in /public/brand */
export const brand = (file) => `${import.meta.env.BASE_URL}brand/${file}`;

/**
 * Image URL helper. Unsplash photo ids (photo-…) become sized CDN links;
 * anything else (e.g. '/products/jhumka.jpg') is returned as-is.
 */
export function img(src, w, h, crop) {
  if (!src.startsWith('photo-')) return src;
  const cropParam = crop ? `&crop=${crop}` : '';
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${w}&h=${h}&q=75${cropParam}`;
}

export function srcSet(src, w, h, crop) {
  if (!src.startsWith('photo-')) return undefined;
  return `${img(src, w, h, crop)} ${w}w, ${img(src, w * 2, h * 2, crop)} ${w * 2}w`;
}

/** WhatsApp link. Without a number, WhatsApp lets the visitor pick who to send it to. */
export function whatsappUrl(number, text) {
  const digits = (number || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/** A tighter, zoomed framing of the same photo: used as the "second image" until real extra photos exist. */
export function imgDetail(src, w, h) {
  if (!src.startsWith('photo-')) return src;
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${w}&h=${h}&q=75&crop=focalpoint&fp-x=0.5&fp-y=0.45&fp-z=2.2`;
}

export function srcSetDetail(src, w, h) {
  if (!src.startsWith('photo-')) return undefined;
  return `${imgDetail(src, w, h)} ${w}w, ${imgDetail(src, w * 2, h * 2)} ${w * 2}w`;
}
