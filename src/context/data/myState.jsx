import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { Timestamp, addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, writeBatch, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../firebase/FirebaseConfig';

function myState(props) {
    const [mode, setMode] = useState('light');
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [searchkey, setSearchkey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    
    const [products, setProducts] = useState({
        title: null,
        price: null,
        imageUrl: null,
        category: null,
        description: null,
        available: true,
        time: Timestamp.now(),
        orderIndex: 0
    });

    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
        document.body.style.backgroundColor = mode === 'light' ? "rgb(17, 24, 39)" : "white";
    };

    const addProduct = async () => {
        if (!products.title || !products.price || !products.imageUrl || !products.category || !products.description) {
            return toast.error("All fields are required");
        }
        setLoading(true);
        try {
            const productRef = collection(fireDB, 'products');
            const snapshot = await getDocs(productRef);
            const orderIndex = snapshot.size; 
            await addDoc(productRef, { ...products, available: products.available ?? true, orderIndex });
            toast.success("Product added successfully");
            getProductData();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getProductData = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'products'), orderBy('orderIndex'));
            onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                if (productArray.length === 0) {
                    console.warn("No products found or missing orderIndex field.");
                }
                setProduct(productArray);
            });
        } catch (error) {
            console.log("Error fetching products:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProductData();
    }, []);

    const updateProductOrder = async (updatedProducts) => {
        setLoading(true);
        try {
            const batch = writeBatch(fireDB);
            updatedProducts.forEach((item, index) => {
                const productRef = doc(fireDB, 'products', item.id);
                batch.update(productRef, { orderIndex: index });
            });
            await batch.commit();
            getProductData(); // Ensure the UI updates with latest order
        } catch (error) {
            console.error('Error updating product order:', error);
        }
        setLoading(false);
    };

    const edithandle = (item) => {
        setProducts(item);
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', products.id), { ...products });
            toast.success("Product updated successfully");
            getProductData();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteProduct = async (item) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', item.id));
            toast.success('Product Deleted successfully');
            getProductData();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            products, setProducts, addProduct, product,
            edithandle, updateProduct, deleteProduct, order,
            user, searchkey, setSearchkey, filterType, setFilterType,
            filterPrice, setFilterPrice, updateProductOrder
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default myState;
