import Listing from '../components/Listing.jsx';
import PageHead from '../components/PageHead.jsx';
import { useQuery } from '../lib/router.jsx';

const TITLES = {
  new: ['Just in', 'New Arrivals', 'Fresh additions to the collection.'],
  best: ['Loved by many', 'Best Sellers', 'The pieces our customers choose most.'],
};

export default function Shop() {
  const [params] = useQuery();
  const [eyebrow, title, lede] = TITLES[params.get('view')] || [
    'Handpicked for you',
    'Our Collection',
    'Traditional charm, crafted to make every moment shine.',
  ];
  return (
    <>
      <PageHead eyebrow={eyebrow} title={title} lede={lede} trail={[]} />
      <section className="section section-tight">
        <div className="container">
          <Listing />
        </div>
      </section>
    </>
  );
}
