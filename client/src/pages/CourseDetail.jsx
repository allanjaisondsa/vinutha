import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { SERVER_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './styles/CourseDetail.css';


// Converts a YouTube watch URL to embed URL, or prefixes /uploads/ paths with server URL
function toEmbedUrl(url) {
  if (!url) return '';
  // Uploaded file — prefix with server base URL
  if (url.startsWith('/uploads/')) return `${SERVER_URL}${url}`;
  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) {
    const id = url.includes('youtu.be/')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('youtube.com/embed/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  return url; // raw MP4 or other direct URL
}


function VideoPlayer({ url, title }) {
  const embed = toEmbedUrl(url);
  const isYouTube = embed.includes('youtube.com/embed');

  return (
    <div className="video-player">
      {isYouTube ? (
        <iframe
          src={embed}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={embed} controls controlsList="nodownload">
          Your browser does not support video playback.
        </video>
      )}
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
