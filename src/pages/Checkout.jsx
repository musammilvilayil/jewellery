import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageHead from '../components/PageHead.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { SITE } from '../data/site.js';
import { orderMessage } from '../lib/order.js';
import { Link } from '../lib/router.jsx';
import { formatPrice, img, whatsappUrl } from '../lib/utils.js';

const EMPTY = { name: '', phone: '', email: '', address: '', city: '', state: '', pin: '', note: '' };

function Field({ label, name, value, onChange, error, required, type = 'text', autoComplete, as: As = 'input', ...rest }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <As
        id={`f-${name}`}
        name={name}
        type={As === 'input' ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `e-${name}` : undefined}
        {...rest}
      />
      <label htmlFor={`f-${name}`}>
        {label}
        {required ? '' : ' (optional)'}
      </label>
      <span className="field-line" aria-hidden="true" />
      {error && (
        <p className="field-error" id={`e-${name}`}>
          {error}
        </p>
      )}
    </div>
  );
}

function Confirmation({ order }) {
  return (
    <section className="section confirm">
      <div className="container center">
        <svg className="success" viewBox="0 0 52 52" aria-hidden="true">
          <circle className="success-ring" cx="26" cy="26" r="24" />
          <path className="success-tick" d="m15 27 8 8 15-17" />
        </svg>
        <h1 className="confirm-title">Thank you{order.name ? `, ${order.name.split(' ')[0]}` : ''}</h1>
        <p className="confirm-lede">
          Your order list is ready. Send it to us on WhatsApp and we will reply to confirm availability, delivery and
          payment.
        </p>
        <p className="confirm-note">If WhatsApp did not open, use the button below.</p>
        <div className="confirm-actions">
          <a className="btn btn-gold btn-arrow" href={order.url} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" /> Open WhatsApp <Icon name="arrow" />
          </a>
          <Link className="btn btn-outline" to="/shop">
            Continue shopping
          </Link>
        </div>
        <ul className="confirm-items">
          {order.items.map((i) => (
            <li key={i.id}>
              <img src={img(i.image, 120, 150)} width="48" height="60" alt="" />
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
          <li className="confirm-total">
            <span>Subtotal</span>
            <span>{formatPrice(order.total)}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function Checkout() {
  const { bagItems, bagTotal, bagMrpTotal, clearBag } = useShop();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  if (order) return <Confirmation order={order} />;

  if (bagItems.length === 0) {
    return (
      <>
        <PageHead title="Checkout" />
        <section className="section section-tight">
          <div className="container empty-state">
            <p className="empty-title">Your bag is empty</p>
            <p>Add a piece to your bag to check out.</p>
            <Link className="btn btn-wine" to="/shop">
              Start Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a phone number we can reach you on.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'That email address looks incomplete.';
    if (!form.address.trim()) e.address = 'Please enter your delivery address.';
    if (!form.city.trim()) e.city = 'Please enter your city.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const url = whatsappUrl(SITE.contact.whatsapp, orderMessage(bagItems, bagTotal, form));
    window.open(url, '_blank', 'noopener,noreferrer');
    setOrder({ url, items: bagItems, total: bagTotal, name: form.name.trim() });
    clearBag();
  };

  const saved = bagMrpTotal - bagTotal;

  return (
    <>
      <PageHead eyebrow="Almost there" title="Checkout" trail={[['/cart', 'Bag']]} />
      <section className="section section-tight">
        <div className="container checkout-grid">
          <form className="checkout-form" onSubmit={submit} noValidate>
            <fieldset>
              <legend>Contact</legend>
              <div className="field-row">
                <Field label="Full name" name="name" value={form.name} onChange={set} error={errors.name} required autoComplete="name" />
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set} error={errors.phone} required autoComplete="tel" inputMode="tel" />
              </div>
              <Field label="Email" name="email" type="email" value={form.email} onChange={set} error={errors.email} autoComplete="email" />
            </fieldset>

            <fieldset>
              <legend>Delivery address</legend>
              <Field label="Address" name="address" value={form.address} onChange={set} error={errors.address} required autoComplete="street-address" />
              <div className="field-row field-row-3">
                <Field label="City" name="city" value={form.city} onChange={set} error={errors.city} required autoComplete="address-level2" />
                <Field label="State" name="state" value={form.state} onChange={set} autoComplete="address-level1" />
                <Field label="PIN code" name="pin" value={form.pin} onChange={set} autoComplete="postal-code" inputMode="numeric" />
              </div>
              <Field label="Note for us" name="note" as="textarea" rows={3} value={form.note} onChange={set} />
            </fieldset>

            <fieldset>
              <legend>Delivery & payment</legend>
              <p className="checkout-info">
                <Icon name="chat" /> We confirm delivery and payment with you directly on WhatsApp. No payment is taken on this page.
              </p>
            </fieldset>

            <button className="btn btn-gold btn-block btn-lg btn-arrow" type="submit">
              <Icon name="chat" /> Place Order on WhatsApp <Icon name="arrow" />
            </button>
            <p className="checkout-fine">Your order list and details open in a WhatsApp message to us. We only use them to process your order.</p>
          </form>

          <aside className="summary" aria-label="Order summary">
            <h2>Your order</h2>
            <ul className="summary-items">
              {bagItems.map((i) => (
                <li key={i.id}>
                  <span className="summary-thumb">
                    <img src={img(i.image, 120, 150)} width="56" height="70" alt="" />
                    <span className="count">{i.qty}</span>
                  </span>
                  <span>{i.name}</span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl>
              {saved > 0 && (
                <div className="summary-save">
                  <dt>You save</dt>
                  <dd>−{formatPrice(saved)}</dd>
                </div>
              )}
              <div>
                <dt>Shipping</dt>
                <dd>Confirmed on WhatsApp</dd>
              </div>
              <div className="summary-total">
                <dt>Subtotal</dt>
                <dd>{formatPrice(bagTotal)}</dd>
              </div>
            </dl>
            <Link className="text-link" to="/cart">
              Edit bag
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
