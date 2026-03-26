import { useState, useEffect } from 'react';
import api from '../api/api';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/Home.css';

const WA = '918197366069';
const CATALOGUE_ITEMS = [
  { label: 'Varmala Preservation',         category: 'Varmala Preservation' },
  { label: 'Photo or Flower Preservation',  category: 'Photo or Flower Preservation' },
  { label: 'Baby Keepsake Preservation',    category: 'Baby Keepsake Preservation' },
  { label: 'Home Decore Sindhoor Thalis',   category: 'Home Decore Sindhoor Thalis' },
  { label: 'Wedding Gifts',                category: 'Wedding Gifts' },
  { label: 'Engagement Ring Platters',     category: 'Engagement Ring Platters' },
];

function buildWAMessage(courses) {
  const base = window.location.origin + '/vinutha';
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
  const [courses, setCourses] = useState([]);
  const [courseCategory, setCourseCategory] = useState('All');
  const [cart, setCart] = useState([]); // array of course objects
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (course) => {
    setCart((prev) =>
      prev.some((c) => c.id === course.id)
        ? prev.filter((c) => c.id !== course.id)
        : [...prev, course]
    );
  };

  const inCart = (id) => cart.some((c) => c.id === id);

  const sendToWA = () => {
    window.open(`https://wa.me/${WA}?text=${buildWAMessage(cart)}`, '_blank');
  };

  const courseCategories = ['All', ...new Set(courses.map((c) => c.category || 'General'))];
  const filteredCourses = courseCategory === 'All' 
    ? courses 
    : courses.filter((c) => (c.category || 'General') === courseCategory);

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero-new">
        <div className="hero-new-overlay" />
        <div className="hero-new-content container">
          <p className="hero-new-tagline">WELCOME TO</p>
          <h1 className="hero-new-title">Explore the World of<br />Resin Art</h1>
          <p className="hero-new-sub">
            Select the courses you're interested in and enquire via WhatsApp — all at once!
          </p>
        </div>
      </section>

      {/* ── Courses ─────────────────────────────── */}
      <section className="courses-section">
        <div className="container">
          <h2 className="courses-section-title">Our Courses</h2>
          <p className="courses-section-sub" style={{ marginBottom: 24 }}>
            Tap <strong>+ Add to Enquiry</strong> on any course, then send all enquiries to us in one WhatsApp message.
          </p>

          {!loading && courses.length > 0 && (
            <div className="category-tabs" style={{ justifyContent: 'center' }}>
              {courseCategories.map((c) => (
                <button
                  key={c}
                  className={`btn btn-sm ${courseCategory === c ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCourseCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading && <div className="loading-page"><div className="spinner" /></div>}

          {!loading && filteredCourses.length === 0 && (
            <p className="empty-msg">No courses found for this category.</p>
          )}

          {!loading && filteredCourses.length > 0 && (
            <div className="courses-grid">
              {filteredCourses.map((course) => {
                const selected = inCart(course.id);
                return (
                  <div key={course.id} className={`course-card ${selected ? 'course-card--selected' : ''}`}>
                    <a href={`/vinutha/courses/${course.id}`} className="course-card-img-link">
                      <div className="course-card-img">
                        {course.thumbnail
                          ? <img src={course.thumbnail} alt={course.title} />
                          : <div className="course-card-placeholder">📚</div>
                        }
                        {course.category && (
                          <span className="badge badge-primary course-category">{course.category}</span>
                        )}
                        {selected && <div className="course-card-selected-overlay">✔ Added</div>}
                      </div>
                    </a>
                    <div className="course-card-body">
                      <h3 className="course-card-title">{course.title}</h3>
                      {course.description && (
                        <p className="course-card-desc">
                          {course.description.length > 100
                            ? course.description.slice(0, 100) + '...'
                            : course.description}
                        </p>
                      )}
                      <div className="course-card-footer">
                        <span className="course-price">₹{course.price?.toLocaleString()}</span>
                        <div className="course-card-actions">
                          <a
                            href={`/vinutha/courses/${course.id}`}
                            className="btn btn-outline btn-sm"
                          >
                            Details
                          </a>
                          <button
                            className={`btn btn-sm ${selected ? 'btn-selected' : 'btn-primary'}`}
                            onClick={() => toggle(course)}
                          >
                            {selected ? '✔ Added' : '+ Add to Enquiry'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Catalogue ───────────────────────────── */}
      <section className="catalogue-section">
        <div className="container">
          <h2 className="catalogue-title">CATALOGUE</h2>
          <p className="catalogue-sub">Browse our premium handcrafted collections</p>
          <div className="catalogue-grid">
            {CATALOGUE_ITEMS.map((item) => (
              <a
                key={item.category}
                href={`/vinutha/products?category=${encodeURIComponent(item.category)}`}
                className="catalogue-btn"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating Cart Bar ────────────────────── */}
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
