import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { SERVER_URL } from '../api/api';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/Home.css';

const WA = '918197366069';

function buildWAMessage(courses) {
  const base = window.location.origin;
  const lines = courses.map(
    (c, i) => `${i + 1}. "${c.title}" — ₹${c.price?.toLocaleString()}\n   ${base}/courses/${c.id}`
  );
  const courseIds = courses.map(c => c.id).join(',');
  const adminLink = `${base}/admin?assignCourses=${courseIds}`;
  return encodeURIComponent(
    `Hi! I'm interested in the following courses:\n\n${lines.join('\n\n')}\n\nPlease share payment & enrollment details. 🎨\n\n---\nAdmin Quick Assign:\n${adminLink}`
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('catalogue');
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    api.get('/catalogue')
      .then((res) => setCatalogueItems(res.data))
      .catch(() => {})
      .finally(() => setLoadingCatalogue(false));
  }, []);

  const toggle = (course) => {
    setCart((prev) =>
      prev.some((c) => c.id === course.id)
        ? prev.filter((c) => c.id !== course.id)
        : [...prev, course]
    );
  };

  const sendToWA = () => {
    window.open(`https://wa.me/${WA}?text=${buildWAMessage(cart)}`, '_blank');
  };

  const TABS = [
    { id: 'catalogue', label: 'Catalogue' },
    { id: 'courses',   label: 'Courses' },
    { id: 'products',  label: 'Products', disabled: true },
  ];

  return (
    <div className="home">

      {/* ── Tab Bar ─────────────────────────────────── */}
      <div className="main-tab-bar">
        <div className="container">
          <div className="main-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`main-tab-btn ${activeTab === t.id ? 'main-tab-btn--active' : ''} ${t.disabled ? 'main-tab-btn--disabled' : ''}`}
                onClick={() => !t.disabled && setActiveTab(t.id)}
                disabled={t.disabled}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Tab ────────────────────────────── */}
      {activeTab === 'products' && (
        <section className="tab-section">
          <div className="container">
            <h2 className="tab-section-title">Our Products</h2>
            <p className="tab-section-sub">Handcrafted resin art — order via WhatsApp</p>

            {loadingProducts && <div className="loading-page"><div className="spinner" /></div>}

            {!loadingProducts && products.length === 0 && (
              <p className="empty-msg">No products available yet.</p>
            )}

            {!loadingProducts && products.length > 0 && (
              <div className="product-boxes-grid">
                {products.map((p) => {
                  const img = Array.isArray(p.images) ? p.images[0] : p.images;
                  const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(
                    `Hi! I'd like to order "${p.title}" (₹${p.price}). Please share availability and payment details. 🛍️`
                  )}`;
                  return (
                    <div key={p.id} className="product-box">
                      <div className="product-box-img">
                        {img
                          ? <img src={img} alt={p.title} />
                          : <div className="product-box-placeholder">🛍️</div>
                        }
                        {!p.inStock && <span className="product-box-oos">Out of Stock</span>}
                      </div>
                      <div className="product-box-body">
                        {p.category && <span className="product-box-category">{p.category}</span>}
                        <h4 className="product-box-title">{p.title}</h4>
                        <span className="product-box-price">₹{p.price?.toLocaleString()}</span>
                        {p.inStock !== false && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className="product-box-btn">
                            Order
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Catalogue Tab ───────────────────────────── */}
      {activeTab === 'catalogue' && (
        <section className="tab-section">
          <div className="container">
            <h2 className="tab-section-title">Catalogue</h2>
            <p className="tab-section-sub">Browse our premium handcrafted collections</p>
            {loadingCatalogue && <div className="loading-page"><div className="spinner" /></div>}
            {!loadingCatalogue && catalogueItems.length === 0 && (
              <p className="empty-msg">No catalogue items yet.</p>
            )}
            {!loadingCatalogue && catalogueItems.length > 0 && (
              <div className="catalogue-grid">
                {catalogueItems.map((item) => (
                  <div key={item.id} className="catalogue-box">
                    <div className="catalogue-box-img">
                      {item.image ? (
                        <img 
                          src={item.image.startsWith('/uploads/') ? SERVER_URL + item.image : item.image} 
                          alt={item.label} 
                        />
                      ) : (
                        <div className="catalogue-box-placeholder">🖼️</div>
                      )}
                    </div>
                    <div className="catalogue-box-body">
                      <h4 className="catalogue-box-title">{item.label}</h4>
                      <button 
                        className="catalogue-box-btn"
                        onClick={() => navigate(`/catalogue/${item.id}`)}
                      >
                        Browse Designs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Courses Tab ─────────────────────────────── */}
      {activeTab === 'courses' && (
        <section className="tab-section">
          <div className="container">
            <h2 className="tab-section-title">Our Courses</h2>
            <p className="tab-section-sub">Click a course to learn more and enrol</p>

            {loadingCourses && <div className="loading-page"><div className="spinner" /></div>}

            {!loadingCourses && courses.length === 0 && (
              <p className="empty-msg">No courses available yet.</p>
            )}

            {!loadingCourses && courses.length > 0 && (
              <div className="course-btns-grid">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="course-nav-card"
                  >
                    <span className="course-nav-card-title">{course.title}</span>
                    {course.category && (
                      <span className="course-nav-card-cat">{course.category}</span>
                    )}
                    {course.price && (
                      <span className="course-nav-card-price">₹{course.price?.toLocaleString()}</span>
                    )}
                    <button 
                      className="course-content-btn"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      Course Content
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Floating Cart Bar (courses enquiry) ─────── */}
      {cart.length > 0 && (
        <div className="cart-bar">
          <button className="cart-bar-toggle" onClick={() => setCartOpen(!cartOpen)}>
            🛒 <span className="cart-count">{cart.length}</span>
            <span className="cart-label">
              {cart.length === 1 ? '1 course selected' : `${cart.length} courses selected`}
            </span>
            <span className="cart-chevron">{cartOpen ? '▼' : '▲'}</span>
          </button>

          {cartOpen && (
            <div className="cart-panel">
              <div className="cart-panel-header">
                <p className="cart-panel-title">Your Course Enquiry List</p>
                <button className="cart-clear" onClick={() => { setCart([]); setCartOpen(false); }}>
                  Clear All
                </button>
              </div>
              <ul className="cart-items">
                {cart.map((c) => (
                  <li key={c.id} className="cart-item">
                    <span className="cart-item-name">{c.title}</span>
                    <span className="cart-item-price">₹{c.price?.toLocaleString()}</span>
                    <button className="cart-remove" onClick={() => toggle(c)}>✕</button>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                Total: <strong>₹{cart.reduce((s, c) => s + (c.price || 0), 0).toLocaleString()}</strong>
              </div>
              <button className="btn btn-whatsapp cart-send-btn" onClick={sendToWA}>
                📲 Send Enquiry via WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      <WhatsAppButton />
    </div>
  );
}
