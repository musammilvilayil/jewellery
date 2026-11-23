import BagLine from '../components/BagLine.jsx';
import Icon from '../components/Icon.jsx';
import PageHead from '../components/PageHead.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS } from '../data/products.js';
import { CountUp } from '../lib/motion.jsx';
import { Link } from '../lib/router.jsx';
import { brand, formatPrice } from '../lib/utils.js';

export function Summary({ withCta = true }) {
  const { bagTotal, bagMrpTotal } = useShop();
  const saved = bagMrpTotal - bagTotal;
  return (
    <aside className="summary" aria-label="Order summary">
      <h2>Order summary</h2>
      <dl>
        {saved > 0 && (
          <>
            <div>
              <dt>Original price</dt>
              <dd>{formatPrice(bagMrpTotal)}</dd>
            </div>
            <div className="summary-save">
              <dt>You save</dt>
              <dd>−{formatPrice(saved)}</dd>
            </div>
          </>
        )}
        <div>
          <dt>Shipping</dt>
          <dd>Confirmed on WhatsApp</dd>
        </div>
        <div className="summary-total">
          <dt>Subtotal</dt>
          <dd>
            <CountUp key={bagTotal} value={bagTotal} duration={500} format={(n) => formatPrice(Math.round(n))} />
          </dd>
        </div>
      </dl>
      {withCta && (
        <Link className="btn btn-gold btn-block btn-arrow" to="/checkout">
          Proceed to Checkout <Icon name="arrow" />
        </Link>
      )}
    </aside>
  );
}

export default function Cart() {
  const { bagItems, bagCount } = useShop();
  const inBag = new Set(bagItems.map((i) => i.id));
  const suggestions = PRODUCTS.filter((p) => !inBag.has(p.id)).slice(0, 4);

  return (
    <>
      <PageHead eyebrow="Your selection" title="Shopping Bag" lede={bagCount ? `${bagCount} ${bagCount === 1 ? 'item' : 'items'}` : undefined} />
      <section className="section section-tight">
        <div className="container">
          {bagItems.length === 0 ? (
            <div className="empty-state">
              <img src={brand('logo-emblem-on-light.png')} alt="" width="96" height="61" />
              <p className="empty-title">Your bag is empty</p>
              <p>Discover necklaces, jhumkas, bangles and bridal sets made for your special moments.</p>
              <Link className="btn btn-wine" to="/shop">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-grid">
              <ul className="cart-list">
                {bagItems.map((item, i) => (
                  <BagLine key={item.id} item={item} index={i} showSave />
                ))}
              </ul>
              <Summary />
            </div>
          )}
        </div>
      </section>
      {suggestions.length > 0 && (
        <section className="section section-tint" aria-labelledby="suggest-title">
          <div className="container">
            <SectionHead id="suggest-title" eyebrow="Complete the look" title="You May Also Love" />
            <ProductGrid products={suggestions} />
          </div>
        </section>
      )}
    </>
  );
}
