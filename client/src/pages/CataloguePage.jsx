import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/CataloguePage.css';

const WA = '918197366069';

export default function CataloguePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/catalogue/${id}`)
      .then((res) => setCatalogue(res.data))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  if (notFound) return (
    <div className="cat-page-empty">
      <p>Catalogue not found.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  const products = catalogue?.products ?? [];

  return (
    <div className="cat-page">
      {/* Header */}
      <div className="cat-page-hero">
        <div className="container">
          <button className="cat-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="cat-page-title">{catalogue.label}</h1>
          <p className="cat-page-sub">Handcrafted resin art — order directly via WhatsApp</p>
        </div>
      </div>

      <div className="container cat-page-body">
        {products.length === 0 ? (
          <p className="empty-msg">No products in this catalogue yet.</p>
        ) : (
          <div className="cat-products-grid">
            {products.map((p) => {
              const img = Array.isArray(p.images) ? p.images[0] : p.images;
              const catalogueUrl = `${window.location.origin}/catalogue/${id}`;
              const orderLink = `https://wa.me/${WA}?text=${encodeURIComponent(
                `Hi! I'd like to order "${p.title}" (₹${p.price?.toLocaleString()}) from the ${catalogue.label} collection. Please share availability and payment details. 🛍️`
              )}`;
              const shareLink = `https://wa.me/?text=${encodeURIComponent(
                `Check out "${p.title}" — ₹${p.price?.toLocaleString()} 🛍️\nFrom the *${catalogue.label}* collection at Theresartz!\n${catalogueUrl}`
              )}`;
              return (
                <div key={p.id} className="cat-product-card">
                  <div className="cat-product-img">
                    {img
                      ? <img src={img} alt={p.title} />
                      : <div className="cat-product-placeholder">🛍️</div>
                    }
                    {!p.inStock && <span className="cat-oos-badge">Out of Stock</span>}
                  </div>
                  <div className="cat-product-body">
                    <h3 className="cat-product-title">{p.title}</h3>
                    {p.description && (
                      <p className="cat-product-desc">
                        {p.description.length > 120 ? p.description.slice(0, 120) + '…' : p.description}
                      </p>
                    )}
                    <div className="cat-product-footer">
                      <span className="cat-product-price">₹{p.price?.toLocaleString()}</span>
                      <div className="cat-product-actions">
                        <a href={shareLink} target="_blank" rel="noopener noreferrer" className="cat-share-btn" title="Share on WhatsApp">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Share
                        </a>
                        {p.inStock !== false ? (
                          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                            💬 Order
                          </a>
                        ) : (
                          <span className="cat-oos-text">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
}
