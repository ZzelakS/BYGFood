import React, { useEffect, useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';

function Dashboard() {
    const [dataCounts, setDataCounts] = useState({
        products: 0,
        orders: 0,
        users: 0,
    });

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

    useEffect(() => {
        fetchDataCounts();
    }, []);

    const { products, orders, users } = dataCounts;

    const stats = [
        { count: products, label: 'Products' },
        { count: orders, label: 'Orders' },
        { count: users, label: 'Users' },
    ];

    return (
        <Layout>
            <section className="text-gray-600 body-font mt-10 mb-10">
                <div className="container px-5 mx-auto mb-10">
                    <div className="flex flex-wrap -m-4 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div
                                    className="border-2 hover:shadow-orange-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] bg-orange-100 border-orange-300 px-4 py-3 rounded-xl"
                                >
                                    <div className="text-orange-500 w-12 h-12 mb-3 inline-block">
                                        <FaUserTie size={50} />
                                    </div>
                                    <h2 className="title-font font-medium text-3xl text-black fonts1">
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
