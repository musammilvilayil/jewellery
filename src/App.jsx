import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import BagDrawer from './components/BagDrawer.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import QuickView from './components/QuickView.jsx';
import Toast from './components/Toast.jsx';
import { CATEGORIES } from './data/products.js';
import { useRouter } from './lib/router.jsx';
import Account from './pages/Account.jsx';
import BottomNav from './components/BottomNav.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import { CollectionIndex, CollectionPage } from './pages/Collections.jsx';
import Home from './pages/Home.jsx';
import { ContactPage, InfoPage, StoryPage } from './pages/Info.jsx';
import NotFound from './pages/NotFound.jsx';
import Product from './pages/Product.jsx';
import Shop from './pages/Shop.jsx';
import Wishlist from './pages/Wishlist.jsx';

const INFO = ['faq', 'care', 'shipping', 'returns', 'privacy', 'terms'];

function resolve(path) {
  const parts = path.split('/').filter(Boolean);
  const [root, arg] = parts;
  if (!root) return <Home />;
  if (root === 'shop') return <Shop />;
  if (root === 'collections') {
    if (!arg) return <CollectionIndex />;
    return CATEGORIES.some((c) => c.key === arg) ? <CollectionPage cat={arg} /> : <NotFound />;
  }
  if (root === 'product' && arg) return <Product id={arg} />;
  if (root === 'cart') return <Cart />;
  if (root === 'checkout') return <Checkout />;
  if (root === 'account') return <Account />;
  if (root === 'wishlist') return <Wishlist />;
  if (root === 'story') return <StoryPage />;
  if (root === 'contact') return <ContactPage />;
  if (INFO.includes(root)) return <InfoPage slug={root} />;
  return <NotFound />;
}

const depth = (path) => path.split('/').filter(Boolean).length;

export default function App() {
  const { path } = useRouter();
  const prevDepth = useRef(depth(path));
  const dir = Math.sign(depth(path) - prevDepth.current); // 1 deeper, -1 back up, 0 sibling

  useEffect(() => {
    prevDepth.current = depth(path);
  }, [path]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to main content
      </a>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={path}
          id="main"
          tabIndex={-1}
          initial={{ opacity: 0, x: dir * 28, y: dir ? 0 : 10 }}
          animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
        >
          {resolve(path)}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BottomNav />
      <BagDrawer />
      <QuickView />
      <Toast />
    </MotionConfig>
  );
}
