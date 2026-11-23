import { Link } from '../lib/router.jsx';
import { Reveal, SplitHeading } from '../lib/motion.jsx';

/** Page title block with breadcrumb. `trail` is [[to, label], ...]; the current page is `title`. */
export default function PageHead({ eyebrow, title, lede, trail = [] }) {
  return (
    <div className="page-head">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {trail.map(([to, label]) => (
            <span key={to}>
              <span aria-hidden="true"> / </span>
              <Link to={to}>{label}</Link>
            </span>
          ))}
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{title}</span>
        </nav>
        {eyebrow && (
          <Reveal as="p" className="eyebrow">
            {eyebrow}
          </Reveal>
        )}
        <SplitHeading as="h1" text={title} />
        {lede && (
          <Reveal as="p" className="section-lede" delay={150}>
            {lede}
          </Reveal>
        )}
      </div>
    </div>
  );
}
