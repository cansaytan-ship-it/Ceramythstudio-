import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <footer className="footer">
              <div className="container">
                <p>&copy; 2024 Ceramyth Studio. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
