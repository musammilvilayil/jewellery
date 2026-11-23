import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Modal behaviour: lock page scroll, move focus in, trap Tab, close on Escape, restore focus after. */
export function useDialog(open, onClose, panelRef, firstFocusRef) {
  const returnTo = useRef(null);

  useEffect(() => {
    if (!open) {
      if (returnTo.current) {
        if (returnTo.current.isConnected) returnTo.current.focus();
        returnTo.current = null;
      }
      return undefined;
    }
    returnTo.current = document.activeElement;
    document.documentElement.classList.add('is-locked');
    const t = setTimeout(() => (firstFocusRef?.current || panelRef.current)?.focus(), 60);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
    };
  }, [open, onClose, panelRef, firstFocusRef]);
}
