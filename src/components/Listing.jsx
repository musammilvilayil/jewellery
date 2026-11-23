import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, PRICE_BANDS, PRODUCTS, isBest, isNew } from '../data/products.js';
import { useDialog } from '../lib/dialog.js';
import { useQuery } from '../lib/router.jsx';
import { brand } from '../lib/utils.js';
import Icon from './Icon.jsx';
import ProductGrid from './ProductGrid.jsx';

const SORTERS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: (a, b) => b.added.localeCompare(a.added),
};

const VIEWS = [
  { key: 'all', label: 'All pieces' },
  { key: 'new', label: 'New arrivals' },
  { key: 'best', label: 'Best sellers' },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const list = (v) => (v ? v.split(',').filter(Boolean) : []);

/**
 * Filterable product grid. State lives in the URL (?cat=&price=&view=&sort=&q=) so links from menus,
 * the search box and the browser's back button all work. `fixedCategory` pins it to one collection.
 */
export default function Listing({ fixedCategory }) {
  const [params, setParams] = useQuery();
  const [drawer, setDrawer] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useDialog(drawer && window.matchMedia('(max-width: 900px)').matches, () => setDrawer(false), panelRef, closeRef);

  const cats = fixedCategory ? [fixedCategory] : list(params.get('cat'));
  const prices = list(params.get('price'));
  const view = params.get('view') || 'all';
  const sort = params.get('sort') || 'featured';
  const q = (params.get('q') || '').trim();

  const toggle = (key, current, value) =>
    setParams({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });

  const products = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const labels = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label.toLowerCase()]));
    const bands = PRICE_BANDS.filter((b) => prices.includes(b.key));
    const out = PRODUCTS.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (bands.length && !bands.some((b) => b.test(p.price))) return false;
      if (view === 'new' && !isNew(p)) return false;
      if (view === 'best' && !isBest(p)) return false;
      if (words.length) {
        const hay = `${p.name} ${p.category} ${labels[p.category]} ${p.alt}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    return sort === 'featured' ? out : [...out].sort(SORTERS[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats.join(), prices.join(), view, sort, q]);

  const activeCount = (fixedCategory ? 0 : cats.length) + prices.length + (view !== 'all' ? 1 : 0);
  const clearAll = () => setParams({ cat: null, price: null, view: null, q: null });

  // Close the mobile drawer when the viewport grows past it
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => mq.matches && setDrawer(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const filters = (
    <>
      <div className="filter-group">
        <h3>Show</h3>
        <ul>
          {VIEWS.map((v) => (
            <li key={v.key}>
              <button
                type="button"
                className="filter-option"
                aria-pressed={view === v.key}
                onClick={() => setParams({ view: v.key === 'all' ? null : v.key })}
              >
                <span className="radio" aria-hidden="true" />
                {v.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {!fixedCategory && (
        <div className="filter-group">
          <h3>Collection</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  className="filter-option"
                  aria-pressed={cats.includes(c.key)}
                  onClick={() => toggle('cat', cats, c.key)}
                >
                  <span className="check" aria-hidden="true">
                    <Icon name="check" />
                  </span>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="filter-group">
        <h3>Price</h3>
        <ul>
          {PRICE_BANDS.map((b) => (
            <li key={b.key}>
              <button
                type="button"
                className="filter-option"
                aria-pressed={prices.includes(b.key)}
                onClick={() => toggle('price', prices, b.key)}
              >
                <span className="check" aria-hidden="true">
                  <Icon name="check" />
                </span>
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <div className="listing">
      <div className="listing-bar">
        <button className="btn btn-outline btn-sm filter-open" type="button" onClick={() => setDrawer(true)}>
          <Icon name="filter" /> Filters{activeCount > 0 && ` (${activeCount})`}
        </button>
        <p className="listing-status" role="status" aria-live="polite">
          {q ? `${plural(products.length, 'result')} for “${q}”` : `Showing ${plural(products.length, 'piece')}`}
          {(activeCount > 0 || q) && (
            <button className="link-btn" type="button" onClick={clearAll}>
              Clear all
            </button>
          )}
        </p>
        <div className="sort">
          <label htmlFor="sort-select">Sort by</label>
          <select id="sort-select" value={sort} onChange={(e) => setParams({ sort: e.target.value === 'featured' ? null : e.target.value })}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="listing-body">
        <aside className="filters" aria-label="Filters">
          {filters}
        </aside>

        <div className="listing-main">
          {products.length > 0 ? (
            <ProductGrid products={products} key={products.map((p) => p.id).join()} />
          ) : (
            <div className="empty-state">
              <img src={brand('logo-emblem-on-light.png')} alt="" width="96" height="61" />
              <p className="empty-title">No pieces match</p>
              <p>Try removing a filter, or another word such as necklace, jhumka or bangles.</p>
              <button className="btn btn-outline" type="button" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`overlay${drawer ? ' is-open' : ''} overlay-filters`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`filter-drawer${drawer ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        inert={!drawer}
      >
        <div className="drawer-head">
          <h2>Filters</h2>
          <button ref={closeRef} className="icon-btn" type="button" aria-label="Close filters" onClick={() => setDrawer(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="filter-drawer-body">{filters}</div>
        <div className="drawer-foot">
          <button className="btn btn-wine btn-block" type="button" onClick={() => setDrawer(false)}>
            Show {plural(products.length, 'piece')}
          </button>
          {activeCount > 0 && (
            <button className="link-btn" type="button" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
