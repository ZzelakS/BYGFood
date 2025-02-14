import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
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
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
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
            await addDoc(productRef, { ...products, available: products.available ?? true });
            toast.success("Product added successfully");
            setTimeout(() => { window.location.href = '/dashboard'; }, 800);
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
            const data = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setProduct(productArray);
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProductData();
    }, []);

    const edithandle = (item) => {
        setProducts(item);
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', products.id), { ...products });
            toast.success("Product updated successfully");
            setTimeout(() => { window.location.href = '/dashboard'; }, 800);
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
            filterPrice, setFilterPrice
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default myState;
