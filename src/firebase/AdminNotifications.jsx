import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fireDB } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import notificationSound from "../../public/audio.wav";

const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [audio] = useState(new Audio(notificationSound));
  const navigate = useNavigate();
  const lastNotifiedOrderRef = useRef(null); // Track last notified order

  useEffect(() => {
    audio.loop = false; // Ensure sound plays only once per new order
    
    const q = query(collection(fireDB, "orders"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newOrder = change.doc.data();
          console.log("New order received:", newOrder);
          console.log("Products data:", newOrder.products);

          // Prevent duplicate notifications for the same order
          if (lastNotifiedOrderRef.current === newOrder.id) return;
          lastNotifiedOrderRef.current = newOrder.id;
          
          const productDetails = Array.isArray(newOrder.products) && newOrder.products.length > 0
            ? newOrder.products.map(p => `${p.name} (x${p.quantity})`).join(", ")
            : "No products available";
          setNotifications((prev) => [
            ...prev,
            `New Order! Total: ₦${newOrder.totalAmount}, Products: ${productDetails}`
          ]);
          
          // Play sound only for new orders
          audio.currentTime = 0;
          audio.play();

          // Show a popup with order info
          alert(`New Order Received!\nTotal: ₦${newOrder.totalAmount}\nProducts: ${productDetails}`);

          // Redirect to order details page
          navigate("/thank-you", { state: { order: newOrder } });
        }
      });
    });

    return () => unsubscribe();
  }, [audio, navigate]);

  return { notifications, setNotifications };
};

const OrderNotifications = () => {
  const { notifications, setNotifications } = useAdminNotifications();

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div>
      <h2>Order Notifications</h2>
      <button onClick={clearNotifications}>Clear Notifications</button>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderNotifications;
