import { useShop } from '../context/ShopContext.jsx';
import Icon from './Icon.jsx';

export default function Toast() {
  const { toast, dismissToast } = useShop();

  return (
    <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
      {toast && (
        <>
          <Icon name="check" />
          <span>{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.action.onClick();
                dismissToast();
              }}
            >
              {toast.action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}
