import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar"; // ✅ Import your Navbar

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure we have orderInfo, otherwise redirect back to home
  const orderInfo = location.state?.orderInfo;

  if (!orderInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar /> {/* ✅ Include Navbar */}
        <h1 className="text-2xl font-bold mt-10">No Order Found</h1>
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
      <Navbar /> {/* ✅ Include Navbar at the top */}
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Payment!</h1>
        <p>Your order has been placed successfully.</p>

        <div className="mt-4 p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
          <h2 className="text-lg font-bold">Order Details</h2>
          <p><strong>Name:</strong> {orderInfo.addressInfo.name}</p>
          <p><strong>Email:</strong> {orderInfo.addressInfo.email}</p>
          <p><strong>Total Amount:</strong> ₦{orderInfo.grandTotal}</p>

          <h3 className="font-bold mt-3">Items Ordered:</h3>
          <ul className="list-disc ml-5">
            {orderInfo.cartItems && orderInfo.cartItems.length > 0 ? (
              orderInfo.cartItems.map((item, index) => (
                <li key={index}>{item.title} (x{item.quantity})</li>
              ))
            ) : (
              <p>No items found in order.</p>
            )}
          </ul>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
