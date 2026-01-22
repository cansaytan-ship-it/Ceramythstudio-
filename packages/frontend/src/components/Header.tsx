import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Ceramyth Studio</h1>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                Cart {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
              </Link>
              <Link to="/orders">Orders</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
