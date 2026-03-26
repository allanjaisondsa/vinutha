const WA = '918197366069';

export default function ProductCard({ product }) {
  const img = Array.isArray(product.images) ? product.images[0] : product.images;

  const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(
    `Hi! I'd like to order "${product.title}" (₹${product.price}). Please share availability and payment details. 🛍️`
  )}`;

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        {img
          ? <img src={img} alt={product.title} />
          : <div className="product-card-placeholder">🛍️</div>
        }
        {!product.inStock && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        {product.category && <span className="badge">{product.category}</span>}
        <h3 className="product-card-title">{product.title}</h3>
        {product.description && (
          <p className="product-card-desc">
            {product.description.length > 100
              ? product.description.slice(0, 100) + '...'
              : product.description}
          </p>
        )}
        <div className="product-card-footer">
          <span className="product-price">₹{product.price?.toLocaleString()}</span>
          {product.inStock === false
            ? <span className="out-of-stock-text">Out of Stock</span>
            : (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                💬 Order via WhatsApp
              </a>
            )
          }
        </div>
      </div>
    </div>
  );
}
