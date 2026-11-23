import Icon from '../components/Icon.jsx';
import PageHead from '../components/PageHead.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { SITE } from '../data/site.js';
import { Link } from '../lib/router.jsx';
import { formatPrice, whatsappUrl } from '../lib/utils.js';

/**
 * There is no customer login on this store yet, so this page is honest about it:
 * it shows what is saved on this device and where to get help with an order.
 */
export default function Account() {
  const { bagCount, bagTotal, wishlist } = useShop();
  const cards = [
    { to: '/cart', icon: 'bag', title: 'Shopping bag', text: bagCount ? `${bagCount} ${bagCount === 1 ? 'item' : 'items'} · ${formatPrice(bagTotal)}` : 'Your bag is empty' },
    { to: '/wishlist', icon: 'heart', title: 'Wishlist', text: wishlist.length ? `${wishlist.length} saved` : 'Nothing saved yet' },
    { to: '/contact', icon: 'mail', title: 'Contact us', text: 'Questions about a piece or an order' },
    { to: '/shipping', icon: 'truck', title: 'Shipping & returns', text: 'Delivery and returns information' },
  ];
  return (
    <>
      <PageHead eyebrow="Your account" title="Account" lede="Customer sign-in is not available yet. Your bag and wishlist are saved on this device, and orders are confirmed with you on WhatsApp." />
      <section className="section section-tight">
        <div className="container">
          <ul className="account-grid">
            {cards.map((c) => (
              <li key={c.to}>
                <Link className="account-card" to={c.to}>
                  <span className="contact-icon"><Icon name={c.icon} /></span>
                  <strong>{c.title}</strong>
                  <span>{c.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="center account-help">
            <a className="btn btn-gold" href={whatsappUrl(SITE.contact.whatsapp, `Hello ${SITE.name}! I need help with my order.`)} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" /> Ask about an order
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
