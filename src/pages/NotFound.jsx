import PageHead from '../components/PageHead.jsx';
import { Link } from '../lib/router.jsx';

export default function NotFound() {
  return (
    <>
      <PageHead eyebrow="404" title="Page not found" lede="That page has moved or never existed." />
      <section className="section section-tight">
        <div className="container center">
          <Link className="btn btn-wine" to="/shop">
            Continue shopping
          </Link>
        </div>
      </section>
    </>
  );
}
