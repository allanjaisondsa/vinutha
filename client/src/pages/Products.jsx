import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filtered = category === 'All' ? products : products.filter((p) => p.category === category);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1 className="section-title" style={{ color: '#fff' }}>Our Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '6px' }}>Handcrafted resin art products — order directly via WhatsApp</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="category-tabs">
          {categories.map((c) => (
            <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {filtered.length === 0
          ? <p className="empty-msg">No products in this category.</p>
          : <div className="products-grid">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        }
      </div>
      <WhatsAppButton />
    </div>
  );
}
