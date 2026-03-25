import { useNavigate } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

export default function CourseCard({ course, showEnquire = true }) {
  const navigate = useNavigate();

  return (
    <div className="card course-card">
      <div className="course-card-img">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} />
          : <div className="course-card-placeholder">📚</div>
        }
        <span className="badge badge-primary course-category">{course.category}</span>
      </div>
      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.description?.slice(0, 100)}...</p>
        <div className="course-card-footer">
          <span className="price">₹{course.price?.toLocaleString()}</span>
          <div className="course-card-actions">
            {showEnquire && (
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(
                  `Hi! I'm interested in purchasing "${course.title}". Here's the link: ${window.location.origin}/courses/${course.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >💬 Enquire</a>
            )}
            <button
              onClick={() => navigate(`/courses/${course.id}`)}
              className="btn btn-primary btn-sm"
            >View Course</button>
          </div>
        </div>
      </div>
    </div>
  );
}
