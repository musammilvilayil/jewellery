# Aishwariyam – jewellery website

React + Vite site themed on the Aishwariyam logo: wine background, golden lotus, ivory lettering.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files go to dist/
npm run preview  # serve the dist/ build locally
```

## Where to change things

| What | File |
|---|---|
| Phone, WhatsApp, email, Instagram, address | `src/data/site.js` |
| Products, collections, price bands | `src/data/products.js` |
| FAQ, care, shipping, returns, privacy, terms text (placeholders) | `src/pages/Info.jsx` |
| Colours, fonts, layout, motion | `src/styles/global.css` (colour variables at the top) |
| Scroll-reveal, parallax, count-up helpers | `src/lib/motion.jsx` |
| Logo files, favicon, texture | `public/brand/` (original logo in `design/`) |

Pages use a hash router (`#/shop`, `#/product/<id>`, `#/collections/<key>`, `#/cart`, `#/checkout`, ...), so it works on any static host.

## Ordering

"Order on WhatsApp" in the bag sends the order list as a WhatsApp message. Until a WhatsApp number is
set in `site.js`, WhatsApp asks the visitor which chat to send it to. The bag and wishlist are saved
in the visitor's browser.

## Photos

Product and banner photos are free Unsplash images used as placeholders. To use your own, put the file in
`public/products/` and set `image: '/products/your-photo.jpg'` in `products.js`.
