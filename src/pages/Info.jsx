import Accordion from '../components/Accordion.jsx';
import Icon from '../components/Icon.jsx';
import PageHead from '../components/PageHead.jsx';
import { SITE } from '../data/site.js';
import { Reveal } from '../lib/motion.jsx';
import { Link } from '../lib/router.jsx';
import { whatsappUrl } from '../lib/utils.js';

const ph = (text) => <p className="placeholder">[{text}]</p>;

const CARE_TIPS = [
  'Put jewellery on last, after perfume, hairspray and lotion.',
  'Keep pieces away from water, sweat and chemicals; take them off before bathing or swimming.',
  'Wipe gently with a soft, dry cloth after wearing.',
  'Store each piece separately in a pouch or lined box so it doesn\'t scratch or tangle.',
];

export const FAQS = [
  {
    question: 'How do I place an order?',
    answer: (
      <p>
        Add the pieces you love to your bag, then check out. Your order list is sent to us in a WhatsApp message, and we'll
        reply to confirm availability, delivery and payment.
      </p>
    ),
  },
  { question: 'Shipping information', answer: <>{ph('Add your shipping details here: the areas you deliver to, delivery times and any charges.')}<p><Link className="text-link" to="/shipping">Shipping & delivery</Link></p></> },
  { question: 'Returns & exchanges', answer: <>{ph('Add your returns and exchange policy here: how many days, the condition items must be in, and how to request one.')}<p><Link className="text-link" to="/returns">Returns & refunds</Link></p></> },
  {
    question: 'Caring for your jewellery',
    answer: (
      <>
        <ul>
          {CARE_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p>
          <Link className="text-link" to="/care">
            Full care guide
          </Link>
        </p>
      </>
    ),
  },
];

/** Plain content pages. `body` is a function so the JSX is built only when the page is shown. */
const PAGES = {
  faq: {
    eyebrow: "We're here to help",
    title: 'Frequently Asked Questions',
    body: () => (
      <div className="acc-group acc-wide">
        {FAQS.map((f, i) => (
          <Accordion key={f.question} title={f.question} defaultOpen={i === 0}>
            {f.answer}
          </Accordion>
        ))}
      </div>
    ),
  },
  care: {
    eyebrow: 'Made to last',
    title: 'Jewellery Care Guide',
    lede: 'A little care keeps every piece radiant for the moments to come.',
    body: () => (
      <ol className="steps">
        {CARE_TIPS.map((t, i) => (
          <Reveal as="li" key={t} delay={i * 90}>
            <span className="step-n">{i + 1}</span>
            <p>{t}</p>
          </Reveal>
        ))}
      </ol>
    ),
  },
  shipping: {
    eyebrow: 'Delivery',
    title: 'Shipping & Delivery',
    body: () => ph('Add your shipping details here: the areas you deliver to, delivery times and any charges.'),
  },
  returns: {
    eyebrow: 'Peace of mind',
    title: 'Returns & Refunds',
    body: () => ph('Add your returns and exchange policy here: how many days, the condition items must be in, and how to request one.'),
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    body: () => ph('Add your privacy policy here.'),
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    body: () => ph('Add your terms and conditions here.'),
  },
};

export function InfoPage({ slug }) {
  const page = PAGES[slug];
  if (!page) return null;
  return (
    <>
      <PageHead eyebrow={page.eyebrow} title={page.title} lede={page.lede} />
      <section className="section section-tight">
        <div className="container prose">{page.body()}</div>
      </section>
    </>
  );
}

export function StoryPage() {
  return (
    <>
      <PageHead eyebrow="Our Story" title="Inspired by the Lotus" />
      <section className="section section-tight">
        <div className="container prose prose-story">
          <Reveal as="p" className="lead">
            The lotus rises from still water, untouched and radiant. In Indian tradition it stands for purity, beauty and
            prosperity, and it sits at the heart of everything we make.
          </Reveal>
          <Reveal as="p" delay={100}>
            Our name comes from <em>aishwarya</em>, the Sanskrit word for prosperity. Each Aishwariyam piece is chosen to
            carry that blessing into the moments that matter: a wedding, a festival, a gift, or an ordinary day made
            special.
          </Reveal>
          <ul className="pillars pillars-wide">
            {[
              ['spark', 'Timeless designs', 'Temple, antique and classic styles that never go out of fashion.'],
              ['heart', 'Made to celebrate', 'Pieces for brides, festivals and every day in between.'],
              ['chat', 'Personal service', 'Order and ask questions directly with us on WhatsApp.'],
            ].map(([icon, title, text], i) => (
              <Reveal as="li" key={title} delay={i * 110}>
                <span className="pillar-icon">
                  <Icon name={icon} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="center">
            <Link className="btn btn-gold btn-arrow" to="/shop">
              Find Your Piece <Icon name="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  const { whatsapp, phone, email, instagram, address } = SITE.contact;
  const cards = [
    {
      icon: 'chat',
      title: 'WhatsApp',
      value: whatsapp && `+${whatsapp.replace(/\D/g, '')}`,
      href: whatsapp && whatsappUrl(whatsapp, `Hello ${SITE.name}!`),
      placeholder: '[Add your WhatsApp number]',
      external: true,
    },
    { icon: 'phone', title: 'Call us', value: phone, href: phone && `tel:${phone.replace(/[^\d+]/g, '')}`, placeholder: '[Add your phone number]' },
    { icon: 'mail', title: 'Email', value: email, href: email && `mailto:${email}`, placeholder: '[Add your email address]' },
    {
      icon: 'instagram',
      title: 'Instagram',
      value: instagram && `@${instagram}`,
      href: instagram && `https://www.instagram.com/${instagram}/`,
      placeholder: '[Add your Instagram]',
      external: true,
    },
  ];
  return (
    <>
      <PageHead
        eyebrow="Get in touch"
        title="Contact Us"
        lede="Questions about a piece, custom requests or bridal orders: we'd love to hear from you."
      />
      <section className="section section-tight">
        <div className="container">
          <ul className="contact-grid">
            {cards.map((c, i) => (
              <Reveal as="li" className="contact-card" key={c.title} delay={i * 90}>
                <span className="contact-icon">
                  <Icon name={c.icon} />
                </span>
                <h3>{c.title}</h3>
                {c.value ? (
                  <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {c.value}
                  </a>
                ) : (
                  <span className="placeholder">{c.placeholder}</span>
                )}
              </Reveal>
            ))}
          </ul>
          <p className="contact-address">
            <Icon name="pin" />
            {address ? <span>{address}</span> : <span className="placeholder">[Add your shop address]</span>}
          </p>
        </div>
      </section>
    </>
  );
}
