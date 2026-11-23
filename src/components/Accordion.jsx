import { useState } from 'react';
import Icon from './Icon.jsx';

/** Smooth expand/collapse (grid-rows trick, so it animates to the content's real height). */
export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`acc${open ? ' is-open' : ''}`}>
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {title}
          <Icon name="chevron" />
        </button>
      </h3>
      <div className="acc-panel" role="region" aria-hidden={!open} inert={!open}>
        <div>
          <div className="acc-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
