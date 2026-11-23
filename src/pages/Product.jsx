import { useEffect, useRef, useState } from 'react';
import Accordion from '../components/Accordion.jsx';
import AddButton from '../components/AddButton.jsx';
import Icon from '../components/Icon.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { getProduct, useShop } from '../context/ShopContext.jsx';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { SITE } from '../data/site.js';
import { useDialog } from '../lib/dialog.js';
import { Reveal } from '../lib/motion.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import { formatPrice, img, imgDetail, savingPercent, srcSet, srcSetDetail, whatsappUrl } from '../lib/utils.js';
import NotFound from './NotFound.jsx';

function Gallery({ product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null); // {x, y} while hovering
  const [preview, setPreview] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useDialog(preview, () => setPreview(false), panelRef, closeRef);

  const views = [
    { label: 'Full view', src: (w, h) => img(product.image, w, h), set: (w, h) => srcSet(product.image, w, h) },
    { label: 'Close-up', src: (w, h) => imgDetail(product.image, w, h), set: (w, h) => srcSetDetail(product.image, w, h) },
  ];

  // Mobile: a swipeable strip (scroll-snap). Keep the active dot in step with the swipe.
  const trackRef = useRef(null);
  const onSwipe = (e) => {
    const el = e.currentTarget;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i) => {
    setActive(i);
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="gallery-pdp">
      <ul className="thumbs" aria-label="Product images">
        {views.map((v, i) => (
          <li key={v.label}>
            <button
              type="button"
              className={`thumb${active === i ? ' is-active' : ''}`}
              aria-label={`Show ${v.label.toLowerCase()}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <img src={v.src(120, 150)} width="60" height="75" alt="" />
            </button>
          </li>
        ))}
      </ul>

      <div className="swipe">
        <div className="swipe-track" ref={trackRef} onScroll={onSwipe} role="group" aria-label="Product images, swipe to see more">
          {views.map((v, i) => (
            <button type="button" className="swipe-slide" key={v.label} aria-label={`Enlarge ${v.label.toLowerCase()}`} onClick={() => setPreview(true)}>
              <img
                src={v.src(720, 900)}
                srcSet={v.set(720, 900)}
                sizes="100vw"
                width="720"
                height="900"
                alt={i === 0 ? product.alt : `${product.name}, close-up`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </button>
          ))}
        </div>
        {product.badge && <span className="badge">{product.badge}</span>}
        <div className="swipe-dots">
          {views.map((v, i) => (
            <button key={v.label} type="button" className={`dot${active === i ? ' is-active' : ''}`} aria-label={`Show ${v.label.toLowerCase()}`} aria-pressed={active === i} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`stage${zoom ? ' is-zooming' : ''}`}
        aria-label="Open larger image"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setPreview(true)}
        style={zoom ? { '--zx': `${zoom.x}%`, '--zy': `${zoom.y}%` } : undefined}
      >
        {views.map((v, i) => (
          <img
            key={v.label}
            className={`stage-img${active === i ? ' is-active' : ''}`}
            src={v.src(720, 900)}
            srcSet={v.set(720, 900)}
            sizes="(max-width: 900px) 92vw, 520px"
            width="720"
            height="900"
            alt={i === 0 ? product.alt : `${product.name}, close-up`}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
        ))}
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="zoom-hint" aria-hidden="true">
          <Icon name="expand" />
        </span>
      </button>

      <div className={`lightbox${preview ? ' is-open' : ''}`} ref={panelRef} role="dialog" aria-modal="true" aria-label="Image preview" inert={!preview}>
        <button ref={closeRef} className="icon-btn modal-close" type="button" aria-label="Close preview" onClick={() => setPreview(false)}>
          <Icon name="close" />
        </button>
        <img src={views[active].src(1200, 1500)} alt={product.alt} />
        <div className="lightbox-nav">
          {views.map((v, i) => (
            <button key={v.label} type="button" className={`dot${active === i ? ' is-active' : ''}`} aria-label={v.label} aria-pressed={active === i} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Product({ id }) {
  const product = getProduct(id);
  const { wishlist, toggleWish, addToBag, recent, trackViewed } = useShop();
  const { navigate } = useRouter();
  const [qty, setQty] = useState(1);
  const buyRef = useRef(null);
  const [buyVisible, setBuyVisible] = useState(true);

  useEffect(() => {
    if (product) trackViewed(id);
  }, [id, product, trackViewed]);

  // The sticky bar (mobile) appears once the main buy buttons have scrolled out of view.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setBuyVisible(e.isIntersecting), { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [id, product]);

  if (!product) return <NotFound />;

  const { name, category, price, mrp } = product;
  const cat = CATEGORIES.find((c) => c.key === category);
  const saved = wishlist.includes(id);
  const related = [
    ...PRODUCTS.filter((p) => p.category === category && p.id !== id),
    ...PRODUCTS.filter((p) => p.category !== category),
  ].slice(0, 4);
  const recentlyViewed = recent.filter((r) => r !== id).map(getProduct).slice(0, 4);

  return (
    <>
      <section className="pdp">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/shop">Shop</Link>{' '}
            <span aria-hidden="true">/</span> <Link to={`/collections/${category}`}>{cat.label}</Link>{' '}
            <span aria-hidden="true">/</span> <span aria-current="page">{name}</span>
          </nav>
        </div>
        <div className="container pdp-grid">
          <Reveal variant="fade">
            <Gallery product={product} key={id} />
          </Reveal>

          <div className="pdp-info">
            <p className="eyebrow">{cat.label}</p>
            <h1 className="pdp-title">{name}</h1>
            <p className="product-price big">
              <span className="price">{formatPrice(price)}</span>
              {mrp > price && (
                <>
                  <del>
                    <span className="sr-only">Was </span>
                    {formatPrice(mrp)}
                  </del>
                  <span className="save">{savingPercent(price, mrp)}% off</span>
                </>
              )}
            </p>
            <p className="pdp-lede">
              A heritage-inspired {cat.label.toLowerCase().replace(/s$/, '')} from {SITE.name}, chosen to be worn, gifted
              and treasured.
            </p>

            <div className="pdp-buy" ref={buyRef}>
              <div className="qty qty-lg" role="group" aria-label="Quantity">
                <button type="button" aria-label="One less" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Icon name="minus" />
                </button>
                <span key={qty} className="qty-n" aria-live="polite">
                  {qty}
                </span>
                <button type="button" aria-label="One more" disabled={qty >= 10} onClick={() => setQty((q) => Math.min(10, q + 1))}>
                  <Icon name="plus" />
                </button>
              </div>
              <AddButton id={id} qty={qty} name={name} className="btn btn-wine btn-grow" />
              <button
                className={`wish-btn wish-btn-inline${saved ? ' is-saved' : ''}`}
                type="button"
                aria-pressed={saved}
                aria-label={`Save ${name} to wishlist`}
                onClick={() => toggleWish(id)}
              >
                <Icon name={saved ? 'heartFilled' : 'heart'} />
              </button>
            </div>
            <button
              className="btn btn-gold btn-block btn-arrow"
              type="button"
              onClick={() => {
                addToBag(id, qty, { quiet: true });
                navigate('/checkout');
              }}
            >
              Buy Now <Icon name="arrow" />
            </button>
            <a
              className="text-link"
              href={whatsappUrl(SITE.contact.whatsapp, `Hello ${SITE.name}! I'm interested in the ${name} (${formatPrice(price)}).`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" /> Ask about this piece on WhatsApp
            </a>

            <ul className="trust">
              <li>
                <Icon name="truck" /> Delivery confirmed with you on WhatsApp
              </li>
              <li>
                <Icon name="shield" /> Easy ordering and personal service
              </li>
            </ul>

            <div className="acc-group">
              <Accordion title="Details" defaultOpen>
                <dl className="specs">
                  <div>
                    <dt>Collection</dt>
                    <dd>{cat.label}</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>{formatPrice(price)}</dd>
                  </div>
                  <div>
                    <dt>You save</dt>
                    <dd>{formatPrice(mrp - price)}</dd>
                  </div>
                </dl>
                <p className="placeholder">[Add material, weight, dimensions and stone details for this piece.]</p>
              </Accordion>
              <Accordion title="Authenticity & certification">
                <p className="placeholder">[Add your authenticity, hallmark or certification details here.]</p>
              </Accordion>
              <Accordion title="Delivery & returns">
                <p className="placeholder">[Add your delivery estimate and returns policy.]</p>
                <p>
                  <Link className="text-link" to="/shipping">
                    Shipping & delivery
                  </Link>{' '}
                  ·{' '}
                  <Link className="text-link" to="/returns">
                    Returns & refunds
                  </Link>
                </p>
              </Accordion>
              <Accordion title="Care">
                <p>Wipe gently with a soft, dry cloth after wearing, and store each piece separately in a pouch or lined box.</p>
                <p>
                  <Link className="text-link" to="/care">
                    Full care guide
                  </Link>
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <div className={`sticky-buy${buyVisible ? '' : ' is-shown'}`} inert={buyVisible} aria-label="Quick purchase">
        <div className="sticky-buy-info">
          <strong>{name}</strong>
          <span>{formatPrice(price)}</span>
        </div>
        <AddButton id={id} qty={qty} name={name} className="btn btn-wine" />
      </div>

      <section className="section section-tint" aria-labelledby="related-title">
        <div className="container">
          <SectionHead id="related-title" eyebrow="Complete the look" title="You May Also Love" />
          <ProductGrid products={related} />
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="section" aria-labelledby="recent-title">
          <div className="container">
            <SectionHead id="recent-title" eyebrow="Pick up where you left off" title="Recently Viewed" />
            <ProductGrid products={recentlyViewed} />
          </div>
        </section>
      )}
    </>
  );
}
