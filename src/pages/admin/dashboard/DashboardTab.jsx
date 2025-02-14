import React, { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import myContext from '../../../context/data/myContext';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { FaUser, FaCartPlus } from 'react-icons/fa';
import { AiFillShopping } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

function DashboardTab() {
    const context = useContext(myContext);
    const { mode, product, edithandle, deleteProduct, order, user, updateProductOrder } = context;
    const [sortedProducts, setSortedProducts] = useState([]);

    useEffect(() => {
        setSortedProducts(product);
    }, [product]);

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const productRef = doc(fireDB, 'products', id);
            await updateDoc(productRef, { isAvailable: !currentStatus });
        } catch (error) {
            console.error('Error updating product availability:', error);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSortedProducts((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                const updatedProducts = arrayMove(items, oldIndex, newIndex);
                updateProductOrder(updatedProducts);
                return updatedProducts;
            });
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
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={sortedProducts} strategy={verticalListSortingStrategy}>
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
                                        {sortedProducts.map((item, index) => (
                                            <SortableItem key={item.id} id={item.id} item={item} index={index} toggleAvailability={toggleAvailability} deleteProduct={deleteProduct} edithandle={edithandle} />
                                        ))}
                                    </tbody>
                                </table>
                            </SortableContext>
                        </DndContext>
                    </div>
                </TabPanel>

                <TabPanel>
                    <h1 className="text-center text-3xl font-semibold underline mb-5">Order Details</h1>
                </TabPanel>

                <TabPanel>
                    <h1 className="text-center text-3xl font-semibold underline mb-5">User Details</h1>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default DashboardTab;
