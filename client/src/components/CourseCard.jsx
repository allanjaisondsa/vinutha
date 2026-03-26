const WA = '918197366069';

export default function CourseCard({ course }) {
  const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(
    `Hi! I'm interested in the course "${course.title}" (₹${course.price}). Please share purchase details! 🎨\n\nCourse link: ${window.location.origin}/courses/${course.id}`
  )}`;

  return (
    <div className="course-card">
      <a href={`/courses/${course.id}`} className="course-card-img-link">
        <div className="course-card-img">
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} />
            : <div className="course-card-placeholder">📚</div>
          }
          {course.category && (
            <span className="badge badge-primary course-category">{course.category}</span>
          )}
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
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              💬 Enquire
            </a>
            <a
              href={`/courses/${course.id}`}
              className="btn btn-primary btn-sm"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
