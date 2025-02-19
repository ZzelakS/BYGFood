import React, { useEffect, useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';
import useAdminNotifications from '../../../firebase/AdminNotifications'; // ✅ Import hook
import OrderNotifications from '../../../firebase/AdminNotifications'; // ✅ Import component

function Dashboard() {
    const [dataCounts, setDataCounts] = useState({
        products: 0,
        orders: 0,
        users: 0,
    });

    const { notifications, setNotifications } = useAdminNotifications(); // ✅ Ensure proper destructuring
    const [showNotifications, setShowNotifications] = useState(false); // ✅ Control dropdown visibility

    const fetchDataCounts = async () => {
        try {
            const productsSnapshot = await getDocs(collection(fireDB, 'products'));
            const ordersSnapshot = await getDocs(collection(fireDB, 'orders'));
            const usersSnapshot = await getDocs(collection(fireDB, 'users'));

            setDataCounts({
                products: productsSnapshot.size,
                orders: ordersSnapshot.size,
                users: usersSnapshot.size,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const clearNotifications = () => {
        setNotifications([]); // Clears the notifications state
    };

    useEffect(() => {
        fetchDataCounts();
    }, []);

    return (
        <Layout>
            <section className="text-gray-600 body-font mt-10 mb-10">
                <div className="container px-5 mx-auto mb-10">
                    {/* ✅ Admin Notifications UI */}
                    <div className="relative inline-block">
                        <button
                            className="relative px-4 py-2 bg-orange-500 text-white font-bold rounded-md"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            🛎️ Notifications
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* ✅ Show Notifications Only When Clicked */}
                        {showNotifications && (
                            <div className="absolute z-[999] mt-2 max-w-screen-sm md:max-w-screen-md bg-white border border-gray-300 shadow-lg rounded-lg p-2 left-0 sm:right-0 md:right-0 md:w-72">
                                <h3 className="text-lg font-semibold mb-2">Recent Notifications</h3>
                                {notifications.length > 0 ? (
  notifications.slice(0, 5).map((note, index) => (
    <p key={note.id || index} className="text-sm border-b last:border-none p-2">
      {note.message} {/* ✅ Extract message */}
    </p>
  ))
) : (
  <p className="text-gray-500 text-sm">No new notifications</p>
)}

                                {/* ✅ Clear Notifications Button */}
                                <button
                                    onClick={clearNotifications}
                                    className="w-full mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ✅ Dashboard Statistics */}
                    <div className="flex flex-wrap -m-4 text-center">
                        {[{ count: dataCounts.products, label: 'Products' }, { count: dataCounts.orders, label: 'Orders' }, { count: dataCounts.users, label: 'Users' }].map((stat, index) => (
                            <div key={index} className="p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div className="border-2 shadow-md bg-orange-100 border-orange-300 px-4 py-3 rounded-xl">
                                    <div className="text-orange-500 w-12 h-12 mb-3 inline-block">
                                        <FaUserTie size={50} />
                                    </div>
                                    <h2 className="title-font font-medium text-3xl text-black">
                                        {stat.count}
                                    </h2>
                                    <p className="text-orange-500 font-bold">
                                        Total {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <DashboardTab />
            </section>
        </Layout>
    );
}

export default Dashboard;
