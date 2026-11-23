import { useRef } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { SITE } from '../data/site.js';
import { useDialog } from '../lib/dialog.js';
import { orderMessage } from '../lib/order.js';
import { Link } from '../lib/router.jsx';
import { brand, formatPrice, whatsappUrl } from '../lib/utils.js';
import BagLine from './BagLine.jsx';
import Icon from './Icon.jsx';

export default function BagDrawer() {
  const { bagOpen, closeBag, bagItems, bagCount, bagTotal } = useShop();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useDialog(bagOpen, closeBag, panelRef, closeRef);

  const orderUrl = whatsappUrl(SITE.contact.whatsapp, orderMessage(bagItems, bagTotal));

  return (
    <>
      <div className={`overlay${bagOpen ? ' is-open' : ''}`} onClick={closeBag} aria-hidden="true" />
      <aside
        ref={panelRef}
        className={`drawer${bagOpen ? ' is-open' : ''}`}
        id="bag"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        inert={!bagOpen}
      >
        <div className="drawer-head">
          <h2 id="bag-title">
            Your Bag {bagCount > 0 && <span className="drawer-count">({bagCount})</span>}
          </h2>
          <button ref={closeRef} className="icon-btn" type="button" aria-label="Close bag" onClick={closeBag}>
            <Icon name="close" />
          </button>
        </div>

        {bagItems.length === 0 ? (
          <div className="drawer-empty">
            <img src={brand('logo-emblem-on-light.png')} alt="" width="110" height="70" />
            <p className="empty-title">Your bag is empty</p>
            <p>Discover necklaces, jhumkas, bangles and bridal sets made for your special moments.</p>
            <Link className="btn btn-wine" to="/shop" onClick={closeBag}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-body">
              {bagItems.map((item, i) => (
                <BagLine key={item.id} item={item} index={i} onNavigate={closeBag} />
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(bagTotal)}</strong>
              </div>
              <p className="drawer-note">Delivery is confirmed with you on WhatsApp.</p>
              <Link className="btn btn-gold btn-block btn-arrow" to="/checkout" onClick={closeBag}>
                Checkout <Icon name="arrow" />
              </Link>
              <div className="drawer-secondary">
                <Link className="btn btn-outline btn-block" to="/cart" onClick={closeBag}>
                  View bag
                </Link>
                <a className="btn btn-outline btn-block" href={orderUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="chat" /> WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
