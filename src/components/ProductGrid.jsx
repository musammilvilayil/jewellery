import { useShop } from '../context/ShopContext.jsx';
import ProductCard from './ProductCard.jsx';

/** `wishlistMode` swaps Add to Bag for Move to Bag (used on the wishlist page). */
export default function ProductGrid({ products, className = '', wishlistMode = false }) {
  const { wishlist, toggleWish, openQuickView, moveToBag } = useShop();
  return (
    <div className={`product-grid ${className}`.trim()}>
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          index={i}
          saved={wishlist.includes(p.id)}
          onToggleWish={toggleWish}
          onQuickView={openQuickView}
          onMoveToBag={wishlistMode ? moveToBag : undefined}
        />
      ))}
    </div>
  );
}
