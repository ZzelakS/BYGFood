import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import myContext from "../../context/data/myContext";

function ProductCard() {
  const context = useContext(myContext);
  const { mode, product, searchkey, filterType, filterPrice } = context;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  console.log("Filtered Products:", product);

  const filteredProducts = product
    .filter(
      (obj) =>
        obj.title.toLowerCase().includes(searchkey) &&
        obj.category.toLowerCase().includes(filterType) &&
        obj.price.includes(filterPrice)
    )
    .slice(0, 8);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 md:py-16 mx-auto">
        <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
          <h1
            className="sm:text-3xl text-2xl font-medium title-font mb-2"
            style={{ color: mode === "dark" ? "white" : "" }}
          >
            Our Menu
          </h1>
          <div className="h-1 w-20 bg-orange-600 rounded"></div>
        </div>

        {/* Updated Grid for 4 Cards Per Row on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item, index) => {
            const { title, price, imageUrl, id, isAvailable } = item;
            console.log(`Product: ${title}, isAvailable:`, typeof isAvailable, isAvailable);
            return (
              <div
                key={index}
                className="drop-shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <div
                  className="h-full border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-[320px] mx-auto"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <div
                    onClick={() => navigate(`/productinfo/${id}`)}
                    className="cursor-pointer flex justify-center"
                  >
                    <img
                      className="rounded-2xl w-full h-52 object-cover p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                      src={imageUrl}
                      alt={title}
                    />
                  </div>

                  <div className="p-6 border-t-2">
                    <h2 className="tracking-widest text-xs font-medium text-gray-400">
                      BYG Food
                    </h2>
                    <h1 className="title-font text-lg font-medium mb-3 text-black">
                      {title}
                    </h1>
                    <p className="leading-relaxed mb-3 text-black">₦{price}</p>

                    <div className="flex justify-center">
                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={() => addCart(item)}
                          className="focus:outline-none text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2"
                        >
                          Add To Cart
                        </button>
                      ) : (
                        <span className="text-red-600 font-bold">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
