import '../styles/home-hero.css';
import SpectralTiles from '../components/SpectralTiles.jsx';
import Icon from '../components/Icon.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { CATEGORIES, PRODUCTS, isBest, newestFirst } from '../data/products.js';
import { SITE } from '../data/site.js';
import { Reveal, SplitHeading } from '../lib/motion.jsx';
import { Link } from '../lib/router.jsx';
import { img, srcSet, whatsappUrl } from '../lib/utils.js';

// Home page, laid out to the Figma design. Every product and category comes from the store data.

const SIGNATURE_IMAGE = 'photo-1751606615009-30f61ff1a510';

const bestSellers = PRODUCTS.filter(isBest).slice(0, 4);
const newArrivals = newestFirst().slice(0, 4);

function Hero() {
  return (
    <SpectralTiles as="section" className="fh" background="#641c23" colors={['#f1d36d', '#d4707e', '#e8975a']} aria-labelledby="hero-title">
      <div className="container fh-grid">
        <div className="fh-copy">
          <p className="fh-eyebrow enter" style={{ '--d': '100ms' }}>
            Rooted in tradition. Made for you.
          </p>
          <h1 id="hero-title" className="enter" style={{ '--d': '240ms' }}>
            For moments
            <br />
            that live <em>forever.</em>
          </h1>
          <p className="fh-sub enter" style={{ '--d': '400ms' }}>
            Timeless pieces. Meaningful details.
            <br />
            For every version of the woman you are.
          </p>
          <Link className="btn btn-gold btn-arrow enter" style={{ '--d': '560ms' }} to="/shop">
            Explore the collection <Icon name="arrow" />
          </Link>
        </div>
        <div className="fh-visual">
          <video
            className="fh-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero/hero.jpg"
            preload="metadata"
            aria-label="Jewellery editorial video"
          >
            <source src="/hero/hero.trimmed.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </SpectralTiles>
  );
}

function Head({ id, eyebrow, title, to }) {
  return (
    <header className="fs-head">
      <div>
        <Reveal as="p" className="fs-eyebrow">
          {eyebrow}
        </Reveal>
        <SplitHeading id={id} text={title} />
      </div>
      {to && (
        <Link className="view-all" to={to}>
          View all <Icon name="arrow" />
        </Link>
      )}
    </header>
  );
}

function Categories() {
  return (
    <section className="fs" aria-labelledby="cat-title">
      <div className="container">
        <Head id="cat-title" eyebrow="A world of little treasures" title="Find your kind of beautiful" />
        <p className="fcat-swipe-hint">
          Swipe to explore <Icon name="arrow" />
        </p>
        <ul className="fcat">
          {CATEGORIES.map((c, i) => (
            <Reveal as="li" key={c.key} delay={i * 90}>
              <Link to={`/collections/${c.key}`}>
                <span className="fcat-img">
                  <img
                    src={img(c.image, 420, 520, c.crop)}
                    srcSet={srcSet(c.image, 420, 520, c.crop)}
                    sizes="(max-width: 700px) 45vw, 280px"
                    width="420"
                    height="520"
                    loading="lazy"
                    alt=""
                  />
                </span>
                <span className="fcat-name">
                  {c.cardTitle} <Icon name="arrow" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Shelf({ id, eyebrow, title, to, products }) {
  return (
    <section className="fs" aria-labelledby={id}>
      <div className="container">
        <Head id={id} eyebrow={eyebrow} title={title} to={to} />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

function Signature() {
  return (
    <section className="fsig" aria-labelledby="sig-title">
      <div className="fsig-media">
        <img
          src={img(SIGNATURE_IMAGE, 900, 900, 'faces')}
          srcSet={srcSet(SIGNATURE_IMAGE, 640, 640, 'faces')}
          sizes="(max-width: 900px) 100vw, 50vw"
          width="900"
          height="900"
          loading="lazy"
          alt="Woman wearing traditional Indian necklaces and earrings"
        />
        <span className="fsig-tag">Tradition, beautifully reimagined.</span>
      </div>
      <Reveal className="fsig-copy" variant="left">
        <p className="fs-eyebrow">The signature collection</p>
        <h2 id="sig-title">
          Some things never
          <br />
          go out of soul.
        </h2>
        <p>
          Inspired by heirlooms. Reimagined for today. Discover pieces that carry a little history, and leave room for your
          own.
        </p>
        <Link className="btn btn-outline" to="/collections/Sets">
          Discover the heirloom edit
        </Link>
      </Reveal>
    </section>
  );
}

function Founder() {
  return (
    <section className="ffound" aria-labelledby="founder-title">
      <Reveal className="container ffound-inner">
        <Icon name="spark" />
        <p className="ffound-eyebrow">A note from our founder</p>
        <h2 id="founder-title">
          “Jewellery should feel like you.
          <br />
          <em>Not like everyone else.</em>”
        </h2>
        <p>
          Aishwaryam means prosperity. To us, it’s the richness of stories, the warmth of traditions, and the beauty of being
          yourself.
        </p>
        <Link className="ffound-link" to="/story">
          Meet Aishwaryam by Ash <Icon name="arrow" />
        </Link>
      </Reveal>
    </section>
  );
}

function Look() {
  const { instagram } = SITE.contact;
  const tiles = PRODUCTS.slice(0, 4);
  return (
    <section className="fs" aria-labelledby="look-title">
      <div className="container">
        <Head id="look-title" eyebrow={instagram ? `@${instagram}` : 'Shop the look'} title="Your everyday, a little extraordinary" />
        <ul className="flook">
          {tiles.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 90}>
              <Link to={`/product/${p.id}`}>
                <img
                  src={img(p.image, 420, 420)}
                  srcSet={srcSet(p.image, 420, 420)}
                  sizes="(max-width: 700px) 45vw, 280px"
                  width="420"
                  height="420"
                  loading="lazy"
                  alt={p.alt}
                />
                <span>
                  Shop the look <Icon name="arrow" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stay() {
  return (
    <section className="fstay" aria-labelledby="stay-title">
      <Reveal className="container fstay-inner">
        <p className="fs-eyebrow">Let’s stay a little closer</p>
        <h2 id="stay-title">Good things, in your WhatsApp.</h2>
        <p>New treasures, little stories and bridal enquiries: message us and we will reply to help.</p>
        <a
          className="btn btn-wine btn-arrow"
          href={whatsappUrl(SITE.contact.whatsapp, `Hello ${SITE.name}! Please keep me updated on new pieces.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="chat" /> Message us <Icon name="arrow" />
        </a>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Shelf id="new-title" eyebrow="New chapters, timeless charm" title="Just arrived, forever loved" to="/shop?view=new" products={newArrivals} />
      <Signature />
      <Shelf id="best-title" eyebrow="The pieces you keep coming back to" title="Loved, worn, repeated" to="/shop?view=best" products={bestSellers} />
      <Founder />
      <Look />
      <Stay />
    </>
  );
}
