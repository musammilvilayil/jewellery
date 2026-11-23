import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { PRODUCTS } from '../data/products.js';

const STORAGE_KEY = 'aishwariyam-shop-v1';
const MAX_QTY = 10;
const RECENT_KEY = 'aishwariyam-recent-v1';
const MAX_RECENT = 8;
const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const getProduct = (id) => productById[id];

const ShopContext = createContext(null);

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      cart: Array.isArray(saved.cart)
        ? saved.cart.filter((i) => productById[i.id] && i.qty > 0).map((i) => ({ id: i.id, qty: Math.min(i.qty, MAX_QTY) }))
        : [],
      wishlist: Array.isArray(saved.wishlist) ? saved.wishlist.filter((id) => productById[id]) : [],
    };
  } catch {
    return { cart: [], wishlist: [] };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const qty = action.qty || 1;
      const inCart = state.cart.find((i) => i.id === action.id);
      return {
        ...state,
        cart: inCart
          ? state.cart.map((i) => (i.id === action.id ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
          : [...state.cart, { id: action.id, qty: Math.min(qty, MAX_QTY) }],
      };
    }
    case 'setQty':
      return {
        ...state,
        cart:
          action.qty <= 0
            ? state.cart.filter((i) => i.id !== action.id)
            : state.cart.map((i) => (i.id === action.id ? { ...i, qty: Math.min(action.qty, MAX_QTY) } : i)),
      };
    case 'remove':
      return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
    case 'clear':
      return { ...state, cart: [] };
    case 'toggleWish':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case 'saveForLater':
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.id),
        wishlist: state.wishlist.includes(action.id) ? state.wishlist : [...state.wishlist, action.id],
      };
    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadSaved);
  const [bagOpen, setBagOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);
  const [bump, setBump] = useState(0); // increments on every add: drives the bag-icon animation
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const [recent, setRecent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((id) => productById[id]) : [];
    } catch {
      return [];
    }
  });

  const trackViewed = useCallback((id) => {
    setRecent((r) => {
      const next = [id, ...r.filter((x) => x !== id)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* storage blocked: recently viewed just won't persist */
      }
      return next;
    });
  }, []);


  // Remember the bag and wishlist between visits
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked: the shop still works for this visit */
    }
  }, [state]);

  const showToast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), action ? 4000 : 2600);
  }, []);

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const openBag = useCallback(() => {
    dismissToast();
    setQuickViewId(null);
    setBagOpen(true);
  }, [dismissToast]);
  const closeBag = useCallback(() => setBagOpen(false), []);

  /** `quiet` skips the toast (used where the button itself shows an "Added" state). */
  const addToBag = useCallback(
    (id, qty = 1, { quiet = false } = {}) => {
      dispatch({ type: 'add', id, qty });
      setBump((n) => n + 1);
      if (!quiet) showToast(`${productById[id].name} added to your bag`, { label: 'View bag', onClick: openBag });
    },
    [showToast, openBag],
  );

  /** Move a wishlist piece into the bag. */
  const moveToBag = useCallback(
    (id) => {
      dispatch({ type: 'add', id, qty: 1 });
      dispatch({ type: 'toggleWish', id });
      setBump((n) => n + 1);
      showToast(`${productById[id].name} moved to your bag`, { label: 'View bag', onClick: openBag });
    },
    [showToast, openBag],
  );

  const setQty = useCallback((id, qty) => dispatch({ type: 'setQty', id, qty }), []);
  const removeFromBag = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clearBag = useCallback(() => dispatch({ type: 'clear' }), []);
  const saveForLater = useCallback(
    (id) => {
      dispatch({ type: 'saveForLater', id });
      showToast(`${productById[id].name} moved to your wishlist`);
    },
    [showToast],
  );
  const toggleWish = useCallback((id) => dispatch({ type: 'toggleWish', id }), []);

  const bagItems = useMemo(() => state.cart.map((i) => ({ ...productById[i.id], qty: i.qty })), [state.cart]);
  const bagCount = bagItems.reduce((n, i) => n + i.qty, 0);
  const bagTotal = bagItems.reduce((n, i) => n + i.qty * i.price, 0);
  const bagMrpTotal = bagItems.reduce((n, i) => n + i.qty * i.mrp, 0);

  const value = {
    wishlist: state.wishlist,
    toggleWish,
    recent,
    trackViewed,
    moveToBag,
    bagItems,
    bagCount,
    bagTotal,
    bagMrpTotal,
    addToBag,
    setQty,
    removeFromBag,
    clearBag,
    saveForLater,
    bagOpen,
    openBag,
    closeBag,
    bump,
    quickViewId,
    openQuickView: setQuickViewId,
    closeQuickView: useCallback(() => setQuickViewId(null), []),
    toast,
    showToast,
    dismissToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
