import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { addToCart, deleteFromCart, clearCart, updateQuantity } from "../../redux/cartSlice";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";

function ProductInfo() {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => Array.isArray(state.cart.cart) ? state.cart.cart : []);

  const getProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", params.id));
      if (productTemp.exists()) {
        setProduct({ id: productTemp.id, ...productTemp.data() });
      } else {
        setError("Product not found");
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product");
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, [params.id]);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart");
  };

  const removeCartItem = (id) => {
    dispatch(deleteFromCart(id));
    toast.info("Removed from cart");
  };

  const increaseQuantity = (id) => {
    const existingItem = cartItems.find((item) => item.id === id);
    dispatch(updateQuantity({ id, quantity: existingItem.quantity + 1 }));
  };

  const decreaseQuantity = (id) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (existingItem.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: existingItem.quantity - 1 }));
    } else {
      removeCartItem(id);
    }
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
    toast.info("Cart cleared");
  };

  return (
    <Layout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner-border text-orange-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : product ? (
            <div className="lg:flex lg:gap-8 bg-white shadow-lg rounded-2xl overflow-hidden">
              {/* Product Info */}
              <div className="lg:w-2/3 w-full p-6">
                <div className="flex justify-center">
                  <img
                    alt={product.title}
                    className="w-full max-h-96 object-cover object-center rounded-lg"
                    src={product.imageUrl || "https://via.placeholder.com/400"}
                  />
                </div>

                <div className="mt-6">
                  <h2 className="text-sm uppercase text-gray-500 tracking-wide">BYG Food</h2>
                  <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold">{product.title}</h1>

                  {/* Rating Stars */}
                  <div className="flex items-center mt-2">
                    {Array(Math.round(product.rating || 5))
                      .fill()
                      .map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    <span className="text-gray-600 ml-2 text-sm">{product.reviews || 9} Reviews</span>
                  </div>

                  <p className="leading-relaxed mt-3 text-sm sm:text-base">{product.description}</p>

                  <div className="mt-6">
                    <span className="text-2xl font-semibold text-gray-900">₦{product.price}</span>
                  </div>

                  {/* Add to Cart */}
                  <div className="mt-4">
                    <button
                      onClick={() => addCart(product)}
                      className="w-full sm:w-auto text-white bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg shadow-md transition-all text-sm"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Section */}
              <div className="lg:w-1/3 w-full p-6 bg-gray-100 rounded-r-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                  {cartItems.length > 0 && (
                    <button onClick={clearCartHandler} className="text-red-500 text-sm hover:underline">
                      Clear All
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center">Cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-3 mb-2 rounded-lg shadow">
                      <div className="flex items-center">
                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          <p className="text-xs text-gray-600">₦{item.price}</p>
                          {/* Quantity Controls */}
                          <div className="flex items-center mt-1">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-2 py-1 text-xs bg-gray-300 rounded">
                              −
                            </button>
                            <span className="mx-2 text-sm">{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)} className="px-2 py-1 text-xs bg-gray-300 rounded">
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeCartItem(item.id)} className="text-red-500 text-lg font-bold">
                        ×
                      </button>
                    </div>
                  ))
                )}

                {cartItems.length > 0 && (
                  <div className="mt-4">
                    <button onClick={() => navigate("/cart")} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm shadow-md">
                      Continue to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}

export default ProductInfo;
