import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/** Tiny hash router: works on any static host, no server rewrites needed. */
const RouterContext = createContext(null);

function read() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  return { path: path.startsWith('/') ? path : `/${path}`, search };
}

export function RouterProvider({ children }) {
  const [loc, setLoc] = useState(read);

  useEffect(() => {
    const onChange = () => setLoc(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const target = `#${to}`;
    if (replace) {
      history.replaceState(null, '', target);
      setLoc(read());
    } else {
      window.location.hash = to;
    }
  }, []);

  const value = useMemo(() => ({ ...loc, navigate }), [loc, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

/** Query-string state, e.g. ?cat=Necklaces&sort=newest */
export function useQuery() {
  const { search, path, navigate } = useRouter();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const setParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(search);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) next.delete(k);
        else next.set(k, Array.isArray(v) ? v.join(',') : v);
      });
      const qs = next.toString();
      navigate(qs ? `${path}?${qs}` : path, { replace: true });
    },
    [search, path, navigate],
  );
  return [params, setParams];
}

export function Link({ to, children, onClick, ...rest }) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
