import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../fireabase/FirebaseConfig';


function Cart() {

  const context = useContext(myContext)
  const { mode } = context;

  const dispatch = useDispatch()

  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems)

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Delete cart")
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems])

  const [totalAmout, setTotalAmount] = useState(0);

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price)
    })
    setTotalAmount(temp);
    console.log(temp)
  }, [cartItems])

  const shipping = parseInt(500);

  const grandTotal = shipping + totalAmout;
  // console.log(grandTotal)

  /**========================================================================
   *!                           Payment Intigration
   *========================================================================**/ 

  const [name, setName] = useState("")
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const buyNow = async () => {
    // Validate input fields
    if ([name, address, pincode, phoneNumber].some(field => field.trim() === "")) {
        return toast.error("All fields are required", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    // Safely fetch user details from localStorage
    let user;
    try {
        const userData = localStorage.getItem("user");
        if (!userData) throw new Error("User not found in local storage");
        user = JSON.parse(userData).user;
    } catch (error) {
        console.error("Error fetching user data: ", error);
        return toast.error("An error occurred. Please log in again.", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
        });
    }

    // Construct order information
    const orderInfo = {
        cartItems,
        addressInfo: {
            name,
            address,
            pincode,
            phoneNumber,
        },
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        email: user.email,
        userid: user.uid,
    };

    try {
        // Secure payment configuration
        const config = {
          public_key: "FLWPUBK-c47ba9bc2b5e498e9b2da0a081c784c1-X", // Use your public key
          tx_ref: `order_rcptid_${new Date().getTime()}`, // A unique transaction reference
          amount: Math.round(grandTotal * 100) / 100, // Use appropriate currency format
          currency: "NGN", // Correct ISO currency code
          payment_options: "card, banktransfer, ussd", // List of payment methods
          customer: {
            email: user.email,
            phone_number: phoneNumber,
            name: name,
          },
          customizations: {
            title: "BYG Foods",
            description: "Payment for your order",
            logo: "https://yourdomain.com/logo.png", // Optional logo URL
          },
          callback: async (response) => {
            if (response.status === "successful") {
              console.log("Payment response: ", response);
              toast.success("Payment Successful", { position: "top-center", autoClose: 2000 });
        
              // Save payment details to the database
              orderInfo.paymentId = response.transaction_id;
              try {
                await addDoc(collection(fireDB, "orders"), orderInfo);
              } catch (error) {
                console.error("Error saving order to database: ", error);
                toast.error("Payment successful, but order could not be saved. Please contact support.", {
                  position: "top-center",
                  autoClose: 3000,
                });
              }
            } else {
              toast.error("Payment was not successful", { position: "top-center", autoClose: 2000 });
            }
          },
          onclose: () => {
            console.log("Payment modal closed");
          },
        };
        

        // Open Flutterwave payment
        window.FlutterwaveCheckout(config);
    } catch (error) {
        console.error("Error initiating payment: ", error);
        toast.error("An error occurred while processing your payment. Please try again.", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
        });
    }
};

  return (
    <Layout >
      <div className="h-screen bg-gray-100 pt-5 mb-[200%] " style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
          <div className="rounded-lg md:w-2/3 ">
            {cartItems.map((item, index) => {
              const { title, price, description, imageUrl } = item;
              return (
                <div className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white p-6  sm:flex  sm:justify-start" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
                  <img src={imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h2>
                      <h2 className="text-sm  text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{description}</h2>
                      <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₦{price}</p>
                    </div>
                    <div onClick={() => deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>

                    </div>
                  </div>
                </div>
              )
            })}

          </div>

          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Subtotal</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₦{totalAmout}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Delivery</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₦{shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>Total</p>
              <div className>
                <p className="mb-1 text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>₦{grandTotal}</p>
              </div>
            </div>
            {/* <Modal  /> */}
            <Modal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart