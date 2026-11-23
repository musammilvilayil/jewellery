import { memo } from 'react';
import { CATEGORIES } from '../data/products.js';
import { formatPrice, img, imgDetail, savingPercent, srcSet, srcSetDetail } from '../lib/utils.js';
import { Link } from '../lib/router.jsx';
import { Reveal } from '../lib/motion.jsx';
import AddButton from './AddButton.jsx';
import Icon from './Icon.jsx';

const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

function ProductCard({ product, saved, onToggleWish, onQuickView, onMoveToBag, index = 0 }) {
  const { id, name, category, price, mrp, badge, image, alt } = product;
  const href = `/product/${id}`;

  return (
    <Reveal as="article" className="product-card" delay={(index % 4) * 90}>
      <div className="product-media">
        <Link to={href} className="product-media-link" tabIndex={-1} aria-hidden="true">
          <img
            className="img-primary"
            src={img(image, 360, 450)}
            srcSet={srcSet(image, 360, 450)}
            sizes="(max-width: 640px) 46vw, (max-width: 1100px) 30vw, 290px"
            width="360"
            height="450"
            loading="lazy"
            decoding="async"
            alt=""
          />
          <img
            className="img-secondary"
            src={imgDetail(image, 360, 450)}
            srcSet={srcSetDetail(image, 360, 450)}
            sizes="(max-width: 640px) 46vw, (max-width: 1100px) 30vw, 290px"
            width="360"
            height="450"
            loading="lazy"
            decoding="async"
            alt=""
          />
        </Link>
        {badge && <span className="badge">{badge}</span>}
        <button
          className={`wish-btn${saved ? ' is-saved' : ''}`}
          type="button"
          aria-pressed={saved}
          aria-label={`Save ${name} to wishlist`}
          onClick={() => onToggleWish(id)}
        >
          <Icon name={saved ? 'heartFilled' : 'heart'} />
        </button>
        <button className="quick-btn" type="button" onClick={() => onQuickView(id)} aria-label={`Quick view ${name}`}>
          <Icon name="eye" /> Quick view
        </button>
      </div>
      <div className="product-body">
        <p className="product-cat">{categoryLabel[category]}</p>
        <h3 className="product-name">
          <Link to={href}>{name}</Link>
          <span className="sr-only">. {alt}</span>
        </h3>
        <p className="product-price">
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
        {onMoveToBag ? (
          <button className="btn btn-outline btn-block" type="button" aria-label={`Move ${name} to bag`} onClick={() => onMoveToBag(id)}>
            Move to Bag
          </button>
        ) : (
          <AddButton id={id} name={name} className="btn btn-outline btn-block" />
        )}
      </div>
    </Reveal>
  );
}

export default memo(ProductCard);
