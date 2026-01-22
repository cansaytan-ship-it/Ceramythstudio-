import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

const Cart: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity > 0) {
      try {
        await updateQuantity(id, quantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="btn btn-small"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="btn btn-small"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button onClick={() => handleRemove(item.id)} className="btn btn-danger">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total:</span>
            <span className="total">${cart.total.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-large">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
