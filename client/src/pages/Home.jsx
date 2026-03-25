import { useState, useEffect } from 'react';
import api from '../api/api';
import CourseCard from '../components/CourseCard';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import './styles/Home.css';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/products')])
      .then(([c, p]) => { setCourses(c.data); setProducts(p.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <p className="hero-tagline">LEARN · CUSTOMISE · BUY</p>
          <h1 className="hero-title">The Resartz Studio</h1>
          <p className="hero-sub">Discover beautiful resin art courses and handcrafted products, all in one place.</p>
          <div className="hero-actions">
            <a href="#courses" className="btn btn-primary">Browse Courses</a>
            <a href="#products" className="btn btn-outline" style={{color:'#fff',borderColor:'#fff'}}>Shop Products</a>
          </div>
        </div>
        <div className="hero-overlay" />
      </section>

      {/* Courses */}
      <section id="courses" className="home-section container">
        <h2 className="section-title">Our Courses</h2>
        <p className="section-subtitle">Learn resin art from scratch or level up your skills.</p>
        {courses.length === 0
          ? <p className="empty-msg">No courses available yet.</p>
          : <div className="grid-3">{courses.map((c) => <CourseCard key={c.id} course={c} />)}</div>
        }
      </section>

      {/* Products */}
      <section id="products" className="home-section container">
        <h2 className="section-title">Our Products</h2>
        <p className="section-subtitle">Handcrafted resin art products available to order.</p>
        {products.length === 0
          ? <p className="empty-msg">No products available yet.</p>
          : <div className="grid-3">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        }
      </section>

      <WhatsAppButton />
    </div>
  );
}
