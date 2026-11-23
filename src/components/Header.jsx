import { useEffect, useMemo, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS } from '../data/products.js';
import { Link, useRouter } from '../lib/router.jsx';
import { brand, formatPrice, img } from '../lib/utils.js';
import Icon from './Icon.jsx';

// Navigation strip, in the order of the design: discovery first, then categories, then brand pages.
const NAV = [
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?view=new', label: 'New Arrivals' },
  { to: '/shop?view=best', label: 'Bestsellers' },
  { to: '/collections/Earrings', label: 'Earrings' },
  { to: '/collections/Necklaces', label: 'Necklaces' },
  { to: '/collections/Bangles', label: 'Bangles' },
  { to: '/collections/Sets', label: 'Jewellery Sets' },
  { to: '/collections', label: 'Collections' },
  { to: '/story', label: 'Our Story' },
];

export default function Header() {
  const { wishlist, bagCount, openBag, bump } = useShop();
  const { path, navigate } = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus whenever the page changes
  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
    setQ('');
  }, [path]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', navOpen);
    return () => document.documentElement.classList.remove('is-locked');
  }, [navOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setNavOpen(false);
      setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const matches = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.alt}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [q]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <div className="header-left">
          <button
            className="icon-btn nav-toggle"
            type="button"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((o) => !o)}
          >
            <Icon name={navOpen ? 'close' : 'menu'} />
          </button>
          <button
            className={`header-search${searchOpen ? ' is-active' : ''}`}
            type="button"
            aria-expanded={searchOpen}
            aria-controls="search-panel"
            aria-label="Search jewellery"
            onClick={() => setSearchOpen((o) => !o)}
          >
            <Icon name={searchOpen ? 'close' : 'search'} />
            <span>Find your treasure</span>
          </button>
        </div>

        <Link className="brand" to="/" aria-label="Aishwariyam – home">
          <img className="brand-emblem" src={brand('logo-emblem.png')} alt="" width="72" height="46" />
          <img className="brand-word" src={brand('logo-wordmark.png')} alt="" width="165" height="26" />
        </Link>

        <div className="header-actions">
          <Link className="icon-btn" to="/account" aria-label="Account">
            <Icon name="user" />
          </Link>
          <Link className="icon-btn" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`}>
            <Icon name="heart" />
            {wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <button
            className="bag-btn"
            type="button"
            aria-haspopup="dialog"
            aria-controls="bag"
            aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
            onClick={openBag}
          >
            <span key={bump} className={`bag-icon${bump ? ' is-bump' : ''}`}>
              <Icon name="bag" />
            </span>
            <span className="bag-n">({bagCount})</span>
          </button>
        </div>
      </div>

      <nav className={`site-nav${navOpen ? ' is-open' : ''}`} id="site-nav" aria-label="Main">
        <ul className="container">
          {NAV.map(({ to, label }, i) => (
            <li key={to} style={{ '--i': i }}>
              <Link className="nav-link" to={to}>
                {label}
              </Link>
            </li>
          ))}
          <li className="nav-mobile-only" style={{ '--i': NAV.length }}>
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div className={`search-panel${searchOpen ? ' is-open' : ''}`} id="search-panel" inert={!searchOpen}>
        <div className="container">
          <form
            className="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <label htmlFor="search-input" className="sr-only">
              Search jewellery
            </label>
            <Icon name="search" className="icon search-icon" />
            <input
              ref={inputRef}
              id="search-input"
              type="search"
              placeholder="Search necklaces, jhumkas, bangles…"
              autoComplete="off"
              enterKeyHint="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="btn btn-gold btn-sm">
              {q.trim() ? `View ${matches.length} ${matches.length === 1 ? 'result' : 'results'}` : 'Search'}
            </button>
          </form>

          <div className="search-results" aria-live="polite">
            {q.trim() && matches.length === 0 && (
              <p className="search-none">No pieces match “{q.trim()}”. Try necklace, jhumka or bangles.</p>
            )}
            {matches.length > 0 && (
              <ul>
                {matches.slice(0, 4).map((p, i) => (
                  <li key={p.id} style={{ '--i': i }}>
                    <Link to={`/product/${p.id}`} className="search-hit">
                      <img src={img(p.image, 120, 150)} width="60" height="75" alt="" />
                      <span>
                        <strong>{p.name}</strong>
                        <span>{formatPrice(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!q.trim() && (
              <p className="search-hint">
                Popular:{' '}
                {['Necklace', 'Jhumka', 'Bangles', 'Bridal'].map((w) => (
                  <button type="button" className="chip chip-sm" key={w} onClick={() => setQ(w)}>
                    {w}
                  </button>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
