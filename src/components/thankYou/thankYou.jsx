import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Debugging: Log state to check if data exists
  useEffect(() => {
    console.log("Location State:", location.state);
  }, [location.state]);

  const orderInfo = location.state?.order;


  if (!orderInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-2xl font-bold mt-10 text-red-600">⚠️ No Order Found</h1>
        <p className="text-gray-700">It looks like you haven't placed an order.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
        <p className="text-lg text-gray-700">Thank you for your payment.</p>

        <div className="mt-6 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-bold">Order Details</h2>
          <p><strong>Name:</strong> {orderInfo.addressInfo.name}</p>
          <p><strong>Email:</strong> {orderInfo.addressInfo.email}</p>
          <p><strong>Total Amount:</strong> ₦{orderInfo.grandTotal}</p>

          <h3 className="font-bold mt-4">Items Ordered:</h3>
          <ul className="list-decimal ml-6 mt-2">
            {orderInfo.cartItems?.length > 0 ? (
              orderInfo.cartItems.map((item, index) => (
                <li key={index} className="text-gray-800">
                  {item.title} <strong>(x{item.quantity})</strong>
                </li>
              ))
            ) : (
              <p className="text-red-500">No items found in order.</p>
            )}
          </ul>
        </div>

        <button
          className="mt-6 px-5 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;