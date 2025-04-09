import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/home/Home';
import Order from './pages/order/Order';
import Cart from './pages/cart/Cart';
import ThankYou from "./components/thankYou/thankYou.jsx";
import Dashboard from './pages/admin/dashboard/Dashboard';
import NoPage from './pages/nopage/NoPage';
import Login from './pages/registration/Login';
import Signup from './pages/registration/Signup';
import ProductInfo from './pages/productInfo/ProductInfo';
import AddProduct from './pages/admin/page/AddProduct';
import UpdateProduct from './pages/admin/page/UpdateProduct';
import Allproducts from './pages/allproducts/Allproducts';
import ContactUs from './pages/contact/Contact';

// Context
import MyState from './context/data/myState';

function App() {
  useEffect(() => {
    console.log('User Agent:', navigator.userAgent);
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('localStorage is available');
    } catch (e) {
      console.warn('localStorage unavailable:', e);
    }

    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      console.log('sessionStorage is available');
    } catch (e) {
      console.warn('sessionStorage unavailable:', e);
    }
  }, []);

  useEffect(() => {
    const paystackScript = document.createElement('script');
    paystackScript.src = 'https://js.paystack.co/v1/inline.js';
    paystackScript.async = true;
    paystackScript.onload = () => console.log('Paystack script loaded');
    paystackScript.onerror = () => console.error('Paystack script failed to load');
    document.body.appendChild(paystackScript);

    return () => {
      document.body.removeChild(paystackScript);
    };
  }, []);

  // Protected Route for Users
  const ProtectedRoute = ({ children }) => {
    let user = null;
    try {
      user = localStorage.getItem('user');
    } catch (e) {
      console.warn('localStorage access failed:', e);
    }

    console.log('User:', user);
    return user ? children : <Navigate to="/login" />;
  };

  // Protected Route for Admin
  const ProtectedRouteForAdmin = ({ children }) => {
    let admin = null;
    try {
      admin = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.warn('localStorage access failed:', e);
    }

    console.log('Admin:', admin);
    if (admin && admin.user && admin.user.email === 'backyardgrill91@gmail.com') {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <MyState>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />

          {/* Protected Routes (User) */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Admin) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteForAdmin>
                <Dashboard />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/addproduct"
            element={
              <ProtectedRouteForAdmin>
                <AddProduct />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/updateproduct"
            element={
              <ProtectedRouteForAdmin>
                <UpdateProduct />
              </ProtectedRouteForAdmin>
            }
          />

          {/* 404 Page */}
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </MyState>
  );
}

export default App;
