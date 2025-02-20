import React, { useContext, useEffect, useRef, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, deleteFromCart, clearCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import { useHydrogenPayment } from 'hydrogenpay-reactjs';
import { Timestamp } from "firebase/firestore"; // ✅ Import Firestore Timestamp
function Cart() {
  const [showCheckout, setShowCheckout] = useState(false); // ✅ Fix: Define state
  const [orderId, setOrderId] = useState(""); // ✅ Track Order ID
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => Array.isArray(state.cart.cart) ? state.cart.cart : []);
  const [paymentComponent, setPaymentComponent] = useState(null);
  const [showPayButton, setShowPayButton] = useState(false); // ✅ Control payment visibility




  // 🛒 Calculate total cost
  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  const removeCommas = (priceString) => {
    if (!priceString) return 0; // Handle null/undefined cases
    return parseFloat(priceString.replace(/,/g, "")) || 0; // Remove commas and parse as float
};



  const deleteCart = (item) => {
    // Convert Firestore Timestamp to a plain date string (or remove it)
    const cleanedItem = { ...item, time: item.time?.toDate?.() || null };
  
    console.log("Deleting item:", cleanedItem); // Debugging
    dispatch(deleteFromCart(cleanedItem));
    toast.success("Item removed from cart");
  };
  
  useEffect(() => {
    if (showCheckout) {
      console.log("Initializing HydrogenCheckout...");
    }
  }, [showCheckout]); // ✅ Trigger when `showCheckout` changes
  
  

  const clearCartItems = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  // Function to handle increasing quantity
  const increaseQuantity = (item) => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  // Function to handle decreasing quantity
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      deleteCart(item); // Remove item if quantity is 1 and user tries to decrease
    }
  };

  useEffect(() => {
    console.log("Updated Cart Items:", cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log("Cart Items:", cartItems); 

    let temp = cartItems.reduce((sum, item) => {
        const price = removeCommas(item.price); 
        console.log("Converted Price:", price, "Type:", typeof price); // Debug price
        const quantity = item.quantity || 1;
        return sum + price * quantity;
    }, 0);

    console.log("Total Amount:", temp); // Debug total
    setTotalAmount(temp);
}, [cartItems]);


  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [shipping, setShipping] = useState(0);

  const shippingFees = {
    "Victoria Island": 2000,
    "Lekki": 2500,
    "Ikoyi": 2000,
    "Ogudu": 3000,
    "Others": 2500,
    "Test": 10,
  };

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
    setShipping(
      selectedLocation === "Test" ? 10 : shippingFees[selectedLocation] || shippingFees["Others"]
    );
  };
  

  const grandTotal = shipping + totalAmount;


  // 🏦 Buy Now Function
  const payment = useHydrogenPayment({
    amount: grandTotal,
    email: email,
    customerName: name,
    apiKey: "PK_LIVE_1ee7c4a1b038bc1ed86bbf10659ef780",
    description: "Order Payment",
    currency: "NGN",
    onSuccess: async (response) => {
      console.log("✅ Payment Success Triggered:", response);
  
      if (response?.status?.toLowerCase() === "paid" || response?.transactionStatus?.toLowerCase() === "paid") {
        console.log("✅ Attempting to save order...");
  
        if (!cartItems.length) {
          console.error("❌ Cannot save order: Cart is empty");
          toast.error("Cannot save order: Cart is empty.");
          return;
        }
  
        try {
          const orderRef = await addDoc(collection(fireDB, "orders"), {
            cartItems,
            addressInfo: { name, address, email, phoneNumber, location },
            shippingFee: shipping,
            totalAmount,
            grandTotal,
            paymentStatus: "successful",
            createdAt: new Date().toISOString(),
          });
  
          console.log("✅ Order saved with ID:", orderRef.id);
          dispatch(clearCart());
          toast.success("Payment Successful!");
  
          setTimeout(() => {
            closeModal();
            navigate("/thank-you", { 
              state: { 
                order: {
                  id: orderRef.id,
                  cartItems,
                  addressInfo: { name, address, email, phoneNumber, location },
                  shippingFee: shipping,
                  totalAmount,
                  grandTotal,
                  paymentStatus: "successful",
                  createdAt: Timestamp.now(), // ✅ Use Firestore's Timestamp
                }
              } 
            });
          
            // ✅ Clear cart AFTER navigation
            dispatch(clearCart());
          }, 2000);
          
          
  
        } catch (error) {
          console.error("❌ Error saving order: ", error);
          toast.error("Failed to save order.");
        }
      }
    },
    onClose: () => {
      console.log("🚪 Payment gateway closed.");
      toast.info("Payment was not completed.");
    }
  });
  
  
    
  const buyNow = () => {
    if ([name, address, email, phoneNumber, location].some((field) => field.trim() === "")) {
      return toast.error("All fields are required", { position: "top-center" });
    }
  
    console.log("Starting payment process...");
    payment(); // ✅ Start payment first
  };
  
  
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 pt-5 flex flex-col" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-7 max-w-7xl justify-center px-6 md:flex md:space-x-6 xl:px-0 flex-grow">
          <div className="rounded-lg md:w-2/3 overflow-auto max-h-[70vh]">
            {cartItems.length === 0 ? <p className="text-center text-gray-500">Cart is empty</p> : cartItems.map((item) => (
              <div key={item.id} className="justify-between mb-6 rounded-lg border bg-white p-6 sm:flex sm:justify-start shadow-lg">
                <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-700">₦{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQuantity(item)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                  <button onClick={() => dispatch(deleteFromCart(item))} className="text-red-500">X</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="flex justify-between"><p>Subtotal</p><p>₦{totalAmount.toLocaleString()}</p></div>
            <div className="flex justify-between"><p>Delivery</p><p>₦{shipping.toLocaleString()}</p></div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3"><p className="text-lg font-bold">Total</p><p className="text-lg font-bold">₦{grandTotal.toLocaleString()}</p></div>
            <Modal
  name={name}
  address={address}
  email={email}
  phoneNumber={phoneNumber}
  location={location}
  setName={setName}
  setAddress={setAddress}
  setEmail={setEmail}
  setPhoneNumber={setPhoneNumber}
  setLocation={setLocation}
  buyNow={buyNow} // ✅ First, save order
  handleLocationChange={handleLocationChange}
/>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
