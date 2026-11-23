import { useShop } from '../context/ShopContext.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import Icon from './Icon.jsx';

/** Phone-only quick navigation: Home, Shop, Wishlist, Account. The bag stays in the header. */
export default function BottomNav() {
  const { path } = useRouter();
  const { wishlist } = useShop();
  const items = [
    { to: '/', label: 'Home', icon: 'home', on: path === '/' },
    { to: '/shop', label: 'Shop', icon: 'grid', on: path.startsWith('/shop') || path.startsWith('/collections') || path.startsWith('/product') },
    { to: '/wishlist', label: 'Wishlist', icon: 'heart', on: path === '/wishlist', count: wishlist.length },
    { to: '/account', label: 'Account', icon: 'user', on: path === '/account' },
  ];
  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      {items.map((i) => (
        <Link key={i.to} to={i.to} className={i.on ? 'is-on' : ''} aria-current={i.on ? 'page' : undefined}>
          <span className="bn-icon">
            <Icon name={i.icon} />
            {i.count > 0 && <span className="count">{i.count}</span>}
          </span>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
