import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@ceramythstudio/shared';
import { productService } from '../services/product.service';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productService.getAll({ featured: true, limit: 4 });
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Please login to add items to cart');
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Ceramyth Studio</h1>
          <p>Discover unique handcrafted ceramic art pieces</p>
          <Link to="/products" className="btn btn-primary btn-large">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>About Our Studio</h2>
          <p>
            Ceramyth Studio creates unique, handcrafted ceramic pieces that blend traditional
            techniques with contemporary design. Each piece is crafted with care and attention
            to detail, making it a perfect addition to your home or a thoughtful gift.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
