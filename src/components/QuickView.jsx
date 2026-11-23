import { useRef } from 'react';
import { getProduct, useShop } from '../context/ShopContext.jsx';
import { CATEGORIES } from '../data/products.js';
import { useDialog } from '../lib/dialog.js';
import { Link } from '../lib/router.jsx';
import { formatPrice, img, savingPercent, srcSet } from '../lib/utils.js';
import AddButton from './AddButton.jsx';
import Icon from './Icon.jsx';

export default function QuickView() {
  const { quickViewId, closeQuickView, wishlist, toggleWish } = useShop();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const open = Boolean(quickViewId);
  useDialog(open, closeQuickView, panelRef, closeRef);

  const p = quickViewId ? getProduct(quickViewId) : null;
  const saved = p ? wishlist.includes(p.id) : false;

  return (
    <>
      <div className={`overlay${open ? ' is-open' : ''}`} onClick={closeQuickView} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`modal${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={p ? `Quick view: ${p.name}` : 'Quick view'}
        inert={!open}
      >
        <button ref={closeRef} className="icon-btn modal-close" type="button" aria-label="Close quick view" onClick={closeQuickView}>
          <Icon name="close" />
        </button>
        {p && (
          <div className="modal-grid">
            <div className="modal-media">
              <img
                src={img(p.image, 520, 650)}
                srcSet={srcSet(p.image, 520, 650)}
                sizes="(max-width: 700px) 90vw, 420px"
                width="520"
                height="650"
                alt={p.alt}
              />
              {p.badge && <span className="badge">{p.badge}</span>}
            </div>
            <div className="modal-info">
              <p className="eyebrow">{CATEGORIES.find((c) => c.key === p.category)?.label}</p>
              <h2>{p.name}</h2>
              <p className="product-price big">
                <span className="price">{formatPrice(p.price)}</span>
                {p.mrp > p.price && (
                  <>
                    <del>{formatPrice(p.mrp)}</del>
                    <span className="save">{savingPercent(p.price, p.mrp)}% off</span>
                  </>
                )}
              </p>
              <p className="modal-desc">{p.alt}.</p>
              <div className="modal-actions">
                <AddButton id={p.id} name={p.name} className="btn btn-wine" />
                <button
                  className={`wish-btn wish-btn-inline${saved ? ' is-saved' : ''}`}
                  type="button"
                  aria-pressed={saved}
                  aria-label={`Save ${p.name} to wishlist`}
                  onClick={() => toggleWish(p.id)}
                >
                  <Icon name={saved ? 'heartFilled' : 'heart'} />
                </button>
              </div>
              <Link className="text-link" to={`/product/${p.id}`} onClick={closeQuickView}>
                View full details <Icon name="arrow" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
