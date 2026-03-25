import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const courses = user.purchasedCourses || [];

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <h1 className="section-title">My Learning</h1>
          <p className="section-subtitle">Welcome back, <strong>{user.name}</strong>!</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📚</div>
          <h3>No courses yet</h3>
          <p>You haven't been enrolled in any courses. Contact the owner via WhatsApp to purchase a course!</p>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent("Hi! I'd like to purchase a course from The Resartz Studio.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >💬 Chat on WhatsApp</a>
        </div>
      ) : (
        <>
          <p className="dashboard-count">{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
          <div className="grid-3">
            {courses.map((course) => (
              <div key={course.id} className="card dashboard-course-card">
                <div className="dcc-img" onClick={() => navigate(`/courses/${course.id}/watch`)}>
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt={course.title} />
                    : <div className="dcc-placeholder">🎬</div>
                  }
                </div>
                <div className="dcc-body">
                  <span className="badge badge-primary">{course.category}</span>
                  <h3 className="dcc-title">{course.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/courses/${course.id}/watch`)}>▶ Start Learning</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/courses/${course.id}`)}>ℹ️ Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
