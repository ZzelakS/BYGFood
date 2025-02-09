import React, { useContext, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';

function AllProducts() {
  const context = useContext(myContext);
  const { mode, product, searchkey, setSearchkey, filterType, setFilterType, filterPrice, setFilterPrice } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart); // Corrected selector

  const addCart = (event, product) => {
    event.stopPropagation(); // Prevents navigation when clicking "Add to Cart"
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto py-8 md:py-16">
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Filter Section */}
            <div className="w-full lg:w-1/4 text-black">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4">Filters</h2>

                {/* Filter by Price */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Filter by Price</h3>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      className="border rounded-lg px-4 py-2 w-full"
                      onChange={(e) => setFilterPrice({ ...filterPrice, min: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="border rounded-lg px-4 py-2 w-full"
                      onChange={(e) => setFilterPrice({ ...filterPrice, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Filter by Category */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
                  <ul className="space-y-2">
                    {['All', 'Jollof Rice', 'Platter', 'Pasta', 'Others'].map((category) => (
                      <li key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          value={category === 'All' ? '' : category.toLowerCase()}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="mr-2"
                        />
                        <label htmlFor={category} className="text-sm">
                          {category}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Product List Section */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h1
                  className="text-2xl sm:text-3xl font-medium title-font text-gray-900"
                  style={{ color: mode === 'dark' ? 'white' : '' }}
                >
                  Products
                </h1>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search for something..."
                    className="border rounded-lg px-4 py-2 text-sm w-full md:w-auto"
                    value={searchkey}
                    onChange={(e) => setSearchkey(e.target.value)}
                  />
                  <select
                    className="border rounded-lg px-4 py-2 text-sm"
                    onChange={(e) => console.log('Sort Option:', e.target.value)}
                  >
                    <option value="default">Sort By: Default</option>
                    <option value="price">Price</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {product
                  .filter((obj) => obj.title.toLowerCase().includes(searchkey))
                  .filter((obj) => (filterType ? obj.category.toLowerCase() === filterType : true))
                  .filter(
                    (obj) =>
                      (!filterPrice.min || obj.price >= filterPrice.min) &&
                      (!filterPrice.max || obj.price <= filterPrice.max)
                  )
                  .map((item, index) => {
                    const { title, price, imageUrl, id } = item;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg border shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer w-full max-w-[320px] mx-auto"
                        onClick={() => (window.location.href = `/productinfo/${id}`)} // Clicking anywhere navigates
                      >
                        <img src={imageUrl} alt={title} className="w-full h-52 object-cover" />
                        <div className="p-4">
                          <h2 className="text-sm text-gray-500">BYG Food</h2>
                          <h1 className="text-lg font-medium text-gray-900 mb-2">{title}</h1>
                          <p className="text-black-600 font-semibold">₦{price}</p>

                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={(e) => addCart(e, item)} // Prevents navigation when clicked
                            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-700 transition-all"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AllProducts;
