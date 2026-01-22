import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@ceramythstudio/shared';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </Link>
      <div className="product-info">
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        {product.stock > 0 ? (
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart && onAddToCart(product.id)}
          >
            Add to Cart
          </button>
        ) : (
          <button className="btn btn-disabled" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
