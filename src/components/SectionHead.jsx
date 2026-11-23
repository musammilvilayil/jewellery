import { Reveal, SplitHeading } from '../lib/motion.jsx';

/**
 * Editorial section title: numbered gold eyebrow and a large heading on the left,
 * the short lede sits beside it on the right.
 */
export default function SectionHead({ id, eyebrow, title, lede, dark = false, children }) {
  return (
    <header className={`section-head${dark ? ' section-head-dark' : ''}`}>
      <div className="section-head-main">
        <Reveal as="p" className={`eyebrow${dark ? ' eyebrow-gold' : ''}`}>
          {eyebrow}
        </Reveal>
        <SplitHeading id={id} text={title} />
      </div>
      {lede && (
        <Reveal as="p" className="section-lede" delay={150}>
          {lede}
        </Reveal>
      )}
      {children}
    </header>
  );
}
