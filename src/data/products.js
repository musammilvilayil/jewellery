// Product photos are free Unsplash images used as placeholders.
// Replace `image` with your own photo (put it in /public/products and use '/products/name.jpg').

export const CATEGORIES = [
  {
    key: 'Necklaces',
    label: 'Necklaces',
    cardTitle: 'Necklaces',
    image: 'photo-1758995116106-113264be5365',
  },
  {
    key: 'Earrings',
    label: 'Earrings',
    cardTitle: 'Earrings & Jhumkas',
    image: 'photo-1778148046574-c1509f5a40d4',
    crop: 'faces',
  },
  {
    key: 'Bangles',
    label: 'Bangles',
    cardTitle: 'Bangles',
    image: 'photo-1690175867343-2af70ea57537',
  },
  {
    key: 'Sets',
    label: 'Jewellery Sets',
    cardTitle: 'Bridal & Jewellery Sets',
    image: 'photo-1737515031439-2998a5bfcb6f',
    crop: 'faces',
  },
];

export const PRODUCTS = [
  {
    id: 'traditional-gold-necklace',
    name: 'Traditional Gold Necklace',
    category: 'Necklaces',
    price: 1499,
    mrp: 1999,
    badge: 'Bestseller',
    added: '2026-01-05',
    image: 'photo-1721103418312-b0057a8c31c2',
    alt: 'Gold necklace with pearl strands and a stone-set pendant on red velvet',
  },
  {
    id: 'temple-gold-earrings',
    name: 'Temple Gold Earrings',
    category: 'Earrings',
    price: 899,
    mrp: 1199,
    badge: 'Popular',
    added: '2026-01-12',
    image: 'photo-1653227907864-560dce4c252d',
    alt: 'Pair of gold temple jhumka earrings on a carved wooden stand',
  },
  {
    id: 'classic-gold-bangles',
    name: 'Classic Gold Bangles',
    category: 'Bangles',
    price: 1299,
    mrp: 1599,
    badge: 'New',
    added: '2026-02-02',
    image: 'photo-1758995116383-f51775896add',
    alt: 'Stack of ornate gold bangles on a dark surface',
  },
  {
    id: 'elegant-jewellery-set',
    name: 'Elegant Jewellery Set',
    category: 'Sets',
    price: 2499,
    mrp: 2999,
    badge: 'Special',
    added: '2026-01-20',
    image: 'photo-1758995115785-d13726ac93f0',
    alt: 'Gold mesh necklace with matching drop earrings on black velvet',
  },
  {
    id: 'antique-gold-necklace',
    name: 'Antique Gold Necklace',
    category: 'Necklaces',
    price: 1899,
    mrp: 2299,
    badge: 'Trending',
    added: '2026-02-15',
    image: 'photo-1769706039344-7ad8d7ec2442',
    alt: 'Layered antique gold necklaces worn with a red silk sari',
  },
  {
    id: 'traditional-jhumka',
    name: 'Traditional Jhumka',
    category: 'Earrings',
    price: 799,
    mrp: 999,
    badge: 'Popular',
    added: '2026-02-20',
    image: 'photo-1714733831162-0a6e849141be',
    alt: 'Pair of silver and gold jhumka earrings with pearl drops',
  },
  {
    id: 'gold-designer-bangles',
    name: 'Gold Designer Bangles',
    category: 'Bangles',
    price: 1099,
    mrp: 1399,
    badge: 'New',
    added: '2026-03-01',
    image: 'photo-1728381031272-ba3f537feadd',
    alt: 'Pair of gold bangles set with red stones on a velvet cushion',
  },
  {
    id: 'bridal-jewellery-set',
    name: 'Bridal Jewellery Set',
    category: 'Sets',
    price: 3299,
    mrp: 3999,
    badge: 'Exclusive',
    added: '2026-03-10',
    image: 'photo-1742627032795-1dfb552448ce',
    alt: 'Bridal necklace and earrings set with coloured stones on a black stand',
  },
];

/** Badges that mark a best-seller. */
export const BEST_BADGES = ['Bestseller', 'Popular', 'Trending'];

export const collectionOf = (key) => CATEGORIES.find((c) => c.key === key);

/** Price bands used by the shop filter. */
export const PRICE_BANDS = [
  { key: 'u1000', label: 'Under ₹1,000', test: (p) => p < 1000 },
  { key: '1000-2000', label: '₹1,000 – ₹2,000', test: (p) => p >= 1000 && p <= 2000 },
  { key: 'o2000', label: 'Above ₹2,000', test: (p) => p > 2000 },
];

export const isBest = (p) => BEST_BADGES.includes(p.badge);
export const newestFirst = () => [...PRODUCTS].sort((a, b) => b.added.localeCompare(a.added));
const NEW_IDS = new Set(newestFirst().slice(0, 4).map((p) => p.id));
export const isNew = (p) => NEW_IDS.has(p.id);
