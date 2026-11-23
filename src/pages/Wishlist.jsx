import PageHead from '../components/PageHead.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS } from '../data/products.js';
import { Link } from '../lib/router.jsx';
import { brand } from '../lib/utils.js';

export default function Wishlist() {
  const { wishlist } = useShop();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
  return (
    <>
      <PageHead
        eyebrow="Saved for later"
        title="Your Wishlist"
        lede={items.length ? `${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}. Tap the heart to remove, or move a piece to your bag.` : undefined}
      />
      <section className="section section-tight">
        <div className="container">
          {items.length ? (
            <ProductGrid products={items} wishlistMode />
          ) : (
            <div className="empty-state">
              <img src={brand('logo-emblem-on-light.png')} alt="" width="96" height="61" />
              <p className="empty-title">Your wishlist is empty</p>
              <p>Tap the heart on any piece to save it here.</p>
              <Link className="btn btn-outline" to="/shop">
                Browse all {PRODUCTS.length} pieces
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
