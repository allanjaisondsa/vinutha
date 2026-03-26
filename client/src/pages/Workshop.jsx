import WhatsAppButton from '../components/WhatsAppButton';
import './styles/Workshop.css';

const WORKSHOP_WHATSAPP = '918197366069';

const WORKSHOPS = [
  {
    icon: '💻',
    type: 'Online Workshop',
    title: 'Live Resin Art Workshop — Online',
    desc: 'Join our interactive live sessions from anywhere in the world. Learn the art of resin in real-time with direct guidance from our instructor.',
    includes: [
      'Live Zoom session (3–4 hours)',
      'Complete materials list provided',
      'Recording shared after the session',
      'Certificate of completion',
      'Post-session Q&A support',
    ],
  },
  {
    icon: '🏠',
    type: 'Offline Workshop',
    title: 'Hands-On Resin Art Workshop — Offline',
    desc: 'Come to our studio and experience a beautiful, hands-on workshop in a comfortable, creative environment.',
    includes: [
      'Venue: Resartz Studio, Bangalore',
      'Duration: Half-day / Full-day sessions',
      'All materials provided',
      'Take your artwork home',
      'Light refreshments included',
      'Certificate of completion',
    ],
  },
];

export default function Workshop() {
  const waMessage = encodeURIComponent("Hi! I'm interested in booking a resin art workshop slot. Please share the details and availability. 🌊");
  const waLink = `https://wa.me/${WORKSHOP_WHATSAPP}?text=${waMessage}`;

  return (
    <div className="workshop-page">

      {/* Hero */}
      <section className="workshop-hero">
        <div className="workshop-hero-overlay" />
        <div className="container workshop-hero-content">
          <p className="workshop-hero-tag">🎨 RESARTZ STUDIO</p>
          <h1 className="workshop-hero-title">Resin Art Workshops</h1>
          <p className="workshop-hero-sub">
            Online &amp; Offline sessions for all levels — beginners to advanced.
            Learn, create, and take your artwork home!
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp-lg">
            📲 Book Your Slot on WhatsApp
          </a>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="workshop-cards-section container">
        <div className="workshop-cards-grid">
          {WORKSHOPS.map((w) => (
            <div key={w.type} className="workshop-card card">
              <div className="workshop-card-header">
                <span className="workshop-card-icon">{w.icon}</span>
                <span className="workshop-type-badge">{w.type}</span>
              </div>
              <h2 className="workshop-card-title">{w.title}</h2>
              <p className="workshop-card-desc">{w.desc}</p>
              <ul className="workshop-includes">
                {w.includes.map((item) => (
                  <li key={item}>✅ {item}</li>
                ))}
              </ul>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-teal btn-full">
                📲 Register via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Strip */}
      <section className="workshop-faq container">
        <h2 className="workshop-faq-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Who can attend?</h4>
            <p>Absolutely everyone! No prior experience is needed. Our workshops cater to complete beginners to experienced artists.</p>
          </div>
          <div className="faq-item">
            <h4>What do I need to bring?</h4>
            <p>For online sessions — just your laptop/phone. For offline sessions — nothing! All materials are provided at our studio.</p>
          </div>
          <div className="faq-item">
            <h4>How do I book?</h4>
            <p>Simply click the "Book Your Slot on WhatsApp" button above. We'll confirm your slot and share all details directly.</p>
          </div>
          <div className="faq-item">
            <h4>What is the cost?</h4>
            <p>Costs vary based on the session type. Message us on WhatsApp for the current pricing and available dates.</p>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
