import Listing from '../components/Listing.jsx';
import Icon from '../components/Icon.jsx';
import PageHead from '../components/PageHead.jsx';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { Reveal, useParallax } from '../lib/motion.jsx';
import { Link } from '../lib/router.jsx';
import { img, srcSet } from '../lib/utils.js';

export function CollectionIndex() {
  return (
    <>
      <PageHead eyebrow="Discover your style" title="Collections" lede="Find the perfect piece for every celebration." />
      <section className="section section-tight">
        <div className="container">
          <ul className="collection-wide">
            {CATEGORIES.map((c, i) => {
              const n = PRODUCTS.filter((p) => p.category === c.key).length;
              return (
                <Reveal as="li" key={c.key} variant="clip" delay={(i % 2) * 120}>
                  <Link className="collection-banner" to={`/collections/${c.key}`}>
                    <img
                      src={img(c.image, 640, 520, c.crop)}
                      srcSet={srcSet(c.image, 640, 520, c.crop)}
                      sizes="(max-width: 700px) 92vw, 560px"
                      width="640"
                      height="520"
                      loading="lazy"
                      alt=""
                    />
                    <span className="collection-banner-text">
                      <strong>{c.cardTitle}</strong>
                      <span>
                        {n} {n === 1 ? 'piece' : 'pieces'} <Icon name="arrow" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

export function CollectionPage({ cat }) {
  const c = CATEGORIES.find((x) => x.key === cat);
  const parallax = useParallax(0.1);
  if (!c) return null;
  const n = PRODUCTS.filter((p) => p.category === c.key).length;

  return (
    <>
      <section className="collection-hero texture" aria-labelledby="collection-title">
        <div className="collection-hero-media">
          <img
            ref={parallax}
            src={img(c.image, 1400, 700, c.crop || 'entropy')}
            srcSet={srcSet(c.image, 800, 400, c.crop || 'entropy')}
            sizes="100vw"
            width="1400"
            height="700"
            alt=""
          />
        </div>
        <div className="container collection-hero-inner">
          <nav className="crumbs crumbs-light" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/collections">Collections</Link>{' '}
            <span aria-hidden="true">/</span> <span aria-current="page">{c.label}</span>
          </nav>
          <p className="eyebrow eyebrow-gold enter" style={{ '--d': '100ms' }}>
            The collection
          </p>
          <h1 id="collection-title" className="enter" style={{ '--d': '220ms' }}>
            {c.cardTitle}
          </h1>
          <p className="enter" style={{ '--d': '360ms' }}>
            {n} {n === 1 ? 'piece' : 'pieces'} in the spirit of Indian tradition, chosen to be worn, gifted and treasured.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <Listing fixedCategory={c.key} />
        </div>
      </section>
    </>
  );
}
