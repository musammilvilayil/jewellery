import { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import Icon from './Icon.jsx';

/** Add-to-bag button that morphs into an "Added" confirmation, then settles back. */
export default function AddButton({ id, qty = 1, className = 'btn btn-wine', label = 'Add to Bag', name }) {
  const { addToBag } = useShop();
  const [added, setAdded] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      className={`${className} add-btn${added ? ' is-added' : ''}`}
      type="button"
      aria-label={name ? `Add ${name} to bag` : undefined}
      onClick={(e) => {
        e.preventDefault();
        addToBag(id, qty, { quiet: true });
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1800);
      }}
    >
      <span className="add-label">{label}</span>
      <span className="add-done" aria-hidden={!added}>
        <Icon name="check" /> Added
      </span>
      <span className="sr-only" role="status">
        {added ? `${name || 'Item'} added to bag` : ''}
      </span>
    </button>
  );
}
