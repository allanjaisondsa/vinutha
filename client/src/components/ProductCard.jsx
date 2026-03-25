export default function ProductCard({ product }) {
  const img = Array.isArray(product.images) ? product.images[0] : null;

  return (
    <div className="card product-card">
      <div className="product-card-img">
        {img
          ? <img src={img} alt={product.title} />
          : <div className="product-card-placeholder">🛍️</div>
        }
        {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        <span className="badge">{product.category}</span>
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-desc">{product.description?.slice(0, 90)}...</p>
        <div className="product-card-footer">
          <span className="price">₹{product.price?.toLocaleString()}</span>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(
              `Hi! I'd like to order "${product.title}" (₹${product.price}). Link: ${window.location.origin}/products`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >💬 Order via WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
