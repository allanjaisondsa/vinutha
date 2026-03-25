import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { SERVER_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/CoursePage.css';


function resolveThumbnail(url) {
  if (!url) return null;
  return url.startsWith('/uploads/') ? `${SERVER_URL}${url}` : url;
}

export default function CoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}/info`)
      .then((res) => setCourse(res.data))
      .catch(() => setError('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (error) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><h2>{error}</h2><Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Home</Link></div>;

  // Check if current logged-in user has purchased this course
  const hasPurchased = user?.purchasedCourses?.some((c) => String(c.id) === String(id));
  const isAdmin = user?.role === 'admin';
  const canWatch = hasPurchased || isAdmin;

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in purchasing "${course.title}". Here's the link: ${window.location.href}`
  );

  return (
    <div className="course-page">
      {/* Hero */}
      <div className="cp-hero">
        <div className="container cp-hero-inner">
          <div className="cp-hero-text">
            <span className="badge badge-primary cp-category">{course.category}</span>
            <h1 className="cp-title">{course.title}</h1>
            <p className="cp-desc">{course.description}</p>

            <div className="cp-meta">
              <span>📚 {course.lessons?.length || 0} lessons</span>
              <span className="price">₹{course.price?.toLocaleString()}</span>
            </div>

            <div className="cp-actions">
              {canWatch ? (
                <button className="btn btn-primary" onClick={() => navigate(`/courses/${id}/watch`)}>
                  ▶ Start Learning
                </button>
              ) : (
                <a
                  href={`https://wa.me/919999999999?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  💬 Enquire on WhatsApp
                </a>
              )}
              <button className="btn btn-outline cp-back" onClick={() => navigate(-1)}>← Back</button>
            </div>

            {!user && (
              <p className="cp-login-hint">
                Already purchased? <Link to="/login">Login</Link> to access the course.
              </p>
            )}
          </div>

          {course.thumbnail && (
            <div className="cp-hero-img">
              <img src={resolveThumbnail(course.thumbnail)} alt={course.title} />
            </div>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <div className="container cp-body">
        <h2 className="cp-section-title">Course Content</h2>
        <p className="cp-section-sub">{course.lessons?.length || 0} lesson{course.lessons?.length !== 1 ? 's' : ''} in this course</p>

        <div className="cp-lesson-list">
          {course.lessons?.length === 0 && <p className="empty-msg">No lessons added yet.</p>}
          {course.lessons?.map((l, i) => (
            <div key={l.id} className="cp-lesson-row">
              <div className="cp-lesson-num">{i + 1}</div>
              <div className="cp-lesson-info">
                <p className="cp-lesson-title">{l.title}</p>
                {l.description && <p className="cp-lesson-desc">{l.description}</p>}
              </div>
              <div className="cp-lesson-right">
                {l.duration && <span className="badge">⏱ {l.duration}</span>}
                {canWatch
                  ? <span className="cp-watch-badge">▶ Watch</span>
                  : <span className="cp-lock">🔒</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {!canWatch && (
          <div className="cp-cta-box">
            <div>
              <h3>Ready to start learning?</h3>
              <p>Contact us via WhatsApp to purchase this course and get instant access.</p>
            </div>
            <a
              href={`https://wa.me/919999999999?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              💬 Buy via WhatsApp — ₹{course.price?.toLocaleString()}
            </a>
          </div>
        )}
      </div>

      <WhatsAppButton course={course} />
    </div>
  );
}
