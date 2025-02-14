import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, clearCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function Cart() {
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => Array.isArray(state.cart.cart) ? state.cart.cart : []);
  console.log(cartItems);

  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  const removeCommas = (priceString) => {
    return Number(priceString.replace(/,/g, ""));
  };
  


  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Item removed from cart");
  };

  const clearCartItems = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    let temp = cartItems.reduce((sum, item) => sum + removeCommas(item.price), 0);
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
    "Others": 2500,
    "Test": 200,
  };

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
    setShipping(shippingFees[selectedLocation] || shippingFees["Others"]);
  };

  const grandTotal = shipping + totalAmount;

  const buyNow = async () => {
    if ([name, address, email, phoneNumber, location].some((field) => field.trim() === "")) {
      return toast.error("All fields are required", { position: "top-center", autoClose: 1000, theme: "colored" });
    }

    const orderInfo = {
      cartItems,
      addressInfo: { name, address, email, phoneNumber, location },
      shippingFee: shipping,
      totalAmount,
      grandTotal,
      date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };

    try {
      const config = {
        public_key: "FLWPUBK-c47ba9bc2b5e498e9b2da0a081c784c1-X",
        tx_ref: `order_${new Date().getTime()}`,
        amount: grandTotal,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: { email, phone_number: phoneNumber, name },
        customizations: { title: "BYG Foods", description: "Payment for your order", logo: "https://res.cloudinary.com/danccwm8m/image/upload/354384-200-removebg-preview_ztu3rn.png" },
        callback: async (response) => {
          if (response.status === "successful") {
            toast.success("Payment Successful", { position: "top-center", autoClose: 2000 });
            orderInfo.paymentId = response.transaction_id;
            orderInfo.paymentStatus = response.status;
            await addDoc(collection(fireDB, "order"), orderInfo);
            toast.success("Order saved successfully!", { position: "top-center", autoClose: 2000 });
          } else {
            toast.error("Payment was not successful", { position: "top-center", autoClose: 1000 });
          }
        },
        onclose: () => console.log("Payment modal closed"),
      };
      window.FlutterwaveCheckout(config);
    } catch (error) {
      console.error("Error initiating payment: ", error);
      toast.error("An error occurred while processing your payment. Please try again.", { position: "top-center", autoClose: 2000, theme: "colored" });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 pt-5 flex flex-col" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-7 max-w-7xl justify-center px-6 md:flex md:space-x-6 xl:px-0 flex-grow">
          <div className="rounded-lg md:w-2/3 overflow-auto max-h-[70vh]">
            {cartItems.length === 0 ? <p className="text-center text-gray-500">Cart is empty</p> : cartItems.map((item) => (
              <div key={item.id} className="justify-between mb-6 rounded-lg border bg-white p-6 sm:flex sm:justify-start shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl w-full sm:w-[90%]">
              <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-700">₦{formatPrice(item.price)}</p>
                </div>
                <button onClick={() => deleteCart(item)} className="text-red-500">X</button>
              </div>
            </div>
            ))}
          </div>
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="flex justify-between"><p>Subtotal</p><p>₦{totalAmount}</p></div>
            <div className="flex justify-between"><p>Delivery</p><p>₦{shipping}</p></div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3"><p className="text-lg font-bold">Total</p><p className="text-lg font-bold">₦{grandTotal}</p></div>
            {/* <button onClick={clearCartItems} className="text-red-500 font-bold mb-4">Clear All</button> */}
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
              handleLocationChange={handleLocationChange}
              buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
