import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import api, { SERVER_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './styles/CourseDetail.css';


// Prepends server URL to local uploads. react-player handles YouTube normally.
function getPlayableUrl(url) {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${SERVER_URL}${url}`;
  return url;
}

function VideoPlayer({ url }) {
  const playableUrl = getPlayableUrl(url);

  return (
    <div className="video-player" style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
      <ReactPlayer
        url={playableUrl}
        controls
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        config={{
          file: {
            attributes: { controlsList: 'nodownload' }
          }
        }}
      />
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load course'))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  if (error) return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
      <h2>{error}</h2>
      <p style={{ color: 'var(--gray-dark)', marginTop: '8px' }}>You need to purchase this course to access the content.</p>
      <a
        href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'd like to purchase a course. Here's the link: ${window.location.href}`)}`}
        target="_blank" rel="noopener noreferrer"
        className="btn btn-primary" style={{ marginTop: '20px' }}
      >💬 Enquire on WhatsApp</a>
    </div>
  );

  const lesson = course?.lessons?.[activeLesson];

  return (
    <div className="course-detail">
      {/* Header */}
      <div className="cd-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '12px' }}>← Back</button>
          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-desc">{course.description}</p>
          <span className="badge badge-primary">{course.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="cd-body container">
        {/* Video area */}
        <div className="cd-main">
          {lesson ? (
            <>
              <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
              <div className="cd-lesson-info">
                <h2>{lesson.title}</h2>
                {lesson.duration && <span className="badge">⏱ {lesson.duration}</span>}
                <p>{lesson.description}</p>
              </div>
            </>
          ) : (
            <div className="cd-no-lessons">No lessons added yet.</div>
          )}
        </div>

        {/* Sidebar: lesson list */}
        <div className="cd-sidebar">
          <h3 className="cd-sidebar-title">Course Content</h3>
          <p className="cd-sidebar-count">{course.lessons?.length || 0} lesson{course.lessons?.length !== 1 ? 's' : ''}</p>
          <ul className="cd-lesson-list">
            {course.lessons?.map((l, i) => (
              <li
                key={l.id}
                className={`cd-lesson-item ${i === activeLesson ? 'active' : ''}`}
                onClick={() => setActiveLesson(i)}
              >
                <span className="lesson-num">{i + 1}</span>
                <div className="lesson-info">
                  <p className="lesson-title">{l.title}</p>
                  {l.duration && <p className="lesson-dur">⏱ {l.duration}</p>}
                </div>
                {i === activeLesson && <span className="lesson-playing">▶</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
