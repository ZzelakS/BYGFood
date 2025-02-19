import React, { useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import myContext from '../../../context/data/myContext';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { FaUser, FaCartPlus } from 'react-icons/fa';
import { AiFillShopping } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

function DashboardTab() {
    const context = useContext(myContext);
    const { mode, product, edithandle, deleteProduct, order, user } = context;

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const productRef = doc(fireDB, 'products', id);
            await updateDoc(productRef, { isAvailable: !currentStatus });
        } catch (error) {
            console.error('Error updating product availability:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <Tabs defaultIndex={0}>
                <TabList className="flex space-x-8 mb-10 justify-center">
                    <Tab>
                        <button className="font-medium border-b-2 border-purple-500 text-purple-500 text-xl px-5 py-1.5 bg-gray-200 rounded-lg">
                            <div className="flex gap-2 items-center">
                                <MdOutlineProductionQuantityLimits /> Products
                            </div>
                        </button>
                    </Tab>
                    <Tab>
                        <button className="font-medium border-b-2 border-orange-500 text-orange-500 text-xl px-5 py-1.5 bg-gray-200 rounded-lg">
                            <div className="flex gap-2 items-center">
                                <AiFillShopping /> Orders
                            </div>
                        </button>
                    </Tab>
                    <Tab>
                        <button className="font-medium border-b-2 border-green-500 text-green-500 text-xl px-5 py-1.5 bg-gray-200 rounded-lg">
                            <div className="flex gap-2 items-center">
                                <FaUser /> Users
                            </div>
                        </button>
                    </Tab>
                </TabList>

                {/* Products Tab */}
                <TabPanel>
                    <h1 className="text-center text-3xl font-semibold underline mb-5">Product Details</h1>
                    <div className="flex justify-end">
                        <button
                            onClick={() => (window.location.href = '/addproduct')}
                            className="text-white bg-orange-600 px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-700">
                            <div className="flex gap-2 items-center">Add Product <FaCartPlus size={20} /></div>
                        </button>
                    </div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs uppercase bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3">S.No</th>
                                    <th className="px-6 py-3">Image</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Available</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((item, index) => (
                                    <tr key={item.id} className="bg-gray-50 border-b">
                                        <td className="px-6 py-4">{index + 1}.</td>
                                        <td className="px-6 py-4">
                                            <img className="w-16" src={item.imageUrl} alt={item.title} />
                                        </td>
                                        <td className="px-6 py-4">{item.title}</td>
                                        <td className="px-6 py-4">₦{item.price}</td>
                                        <td className="px-6 py-4">{item.category}</td>
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleAvailability(item.id, item.isAvailable)}
                                                className={`px-3 py-1 text-white rounded-lg ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {item.isAvailable ? 'Available' : 'Unavailable'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => deleteProduct(item)} className="text-red-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                                <Link to={'/updateproduct'}>
                                                    <button onClick={() => edithandle(item)} className="text-blue-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                {/* Orders Tab */}
                <TabPanel>
    <h1 className="text-center text-3xl font-semibold underline mb-5">Order Details</h1>
    <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs uppercase bg-gray-200">
                <tr>
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3">Products</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                </tr>
            </thead>
            <tbody>
                {order.map((item, index) => {
                    let orderDate;
                    if (item.date && typeof item.date.toDate === 'function') {
                        orderDate = item.date.toDate().toLocaleString();
                    } else if (item.date) {
                        orderDate = new Date(item.date).toLocaleString();
                    } else {
                        orderDate = "N/A";
                    }

                    return (
                        <tr key={item.id} className="bg-gray-50 border-b">
                            <td className="px-6 py-4">{index + 1}.</td>
                            <td className="px-6 py-4">
                                {item.cartItems && item.cartItems.length > 0 ? (
                                    <ul>
                                        {item.cartItems.map((product, pIndex) => (
                                            <li key={pIndex} className="mb-1">
                                                {pIndex + 1}. {product.title} (x{product.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "No products"
                                )}
                            </td>
                            <td className="px-6 py-4">{item.addressInfo.name}</td>
                            <td className="px-6 py-4">₦{item.grandTotal}</td>
                            <td className="px-6 py-4">{orderDate}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-lg ${item.paymentStatus === 'successful' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {item.paymentStatus}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</TabPanel>

                {/* Users Tab */}
                <TabPanel>
                    <h1 className="text-center text-3xl font-semibold underline mb-5">User Details</h1>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs uppercase bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3">S.No</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((item, index) => (
                                    <tr key={item.id} className="bg-gray-50 border-b">
                                        <td className="px-6 py-4">{index + 1}.</td>
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">{item.number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default DashboardTab;