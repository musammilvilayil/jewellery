import { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { Link } from '../lib/router.jsx';
import { formatPrice, img } from '../lib/utils.js';
import Icon from './Icon.jsx';

/** One bag row. Removing fades and slides it out before it leaves the list. */
export default function BagLine({ item, index = 0, onNavigate, showSave = false }) {
  const { setQty, removeFromBag, saveForLater } = useShop();
  const [leaving, setLeaving] = useState(false);

  const leave = (fn) => {
    setLeaving(true);
    setTimeout(fn, 280);
  };

  return (
    <li className={`bag-item${leaving ? ' is-leaving' : ''}`} style={{ '--i': index }}>
      <Link to={`/product/${item.id}`} onClick={onNavigate} className="bag-thumb" tabIndex={-1} aria-hidden="true">
        <img src={img(item.image, 160, 200)} alt="" width="80" height="100" />
      </Link>
      <div className="bag-item-info">
        <h3>
          <Link to={`/product/${item.id}`} onClick={onNavigate}>
            {item.name}
          </Link>
        </h3>
        <p className="bag-item-price">{formatPrice(item.price)}</p>
        <div className="qty" role="group" aria-label={`Quantity of ${item.name}`}>
          <button type="button" aria-label={`One less ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
            <Icon name="minus" />
          </button>
          <span key={item.qty} className="qty-n" aria-live="polite">
            {item.qty}
          </span>
          <button
            type="button"
            aria-label={`One more ${item.name}`}
            disabled={item.qty >= 10}
            onClick={() => setQty(item.id, item.qty + 1)}
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
      <div className="bag-item-end">
        <p className="bag-line-total">{formatPrice(item.price * item.qty)}</p>
        <div className="bag-item-actions">
          {showSave && (
            <button className="link-btn" type="button" aria-label={`Save ${item.name} for later`} onClick={() => leave(() => saveForLater(item.id))}>
              Save for later
            </button>
          )}
          <button className="link-btn" type="button" aria-label={`Remove ${item.name} from bag`} onClick={() => leave(() => removeFromBag(item.id))}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
