import { CATEGORIES } from '../data/products.js';
import { SITE } from '../data/site.js';
import { Link } from '../lib/router.jsx';
import { brand } from '../lib/utils.js';

const HELP = [
  ['/contact', 'Contact Us'],
  ['/faq', 'FAQ'],
  ['/shipping', 'Shipping Policy'],
  ['/returns', 'Return & Refund Policy'],
  ['/care', 'Jewellery Care'],
];

const MORE = [
  ['/story', 'About Us'],
  ['/account', 'My Account'],
  ['/wishlist', 'Wishlist'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms & Conditions'],
];

function Column({ id, title, children }) {
  return (
    <nav className="footer-col" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul>{children}</ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={brand('logo-full.png')} alt={`${SITE.name} – ${SITE.tagline}`} width="220" height="182" loading="lazy" />
          <p>
            Rooted in tradition.
            <br />
            Made for your story.
          </p>
        </div>

        <Column id="footer-explore" title="Explore">
          <li>
            <Link to="/shop">Shop All</Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link to={`/collections/${c.key}`}>{c.cardTitle}</Link>
            </li>
          ))}
        </Column>

        <Column id="footer-help" title="Here to help">
          {HELP.map(([to, label]) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </Column>

        <Column id="footer-more" title="A little more">
          {MORE.map(([to, label]) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </Column>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {SITE.name} by Ash. All rights reserved.
        </p>
        <p>Crafted with intention. Worn with love.</p>
      </div>
    </footer>
  );
}
