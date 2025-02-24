import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from "../../src/audio.mp3";

const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);
  const lastNotifiedTimeRef = useRef(null);
  const isAudioAllowedRef = useRef(false); // ✅ Track user interaction

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.load(); // ✅ Preload the audio file

    // ✅ Listen for user interaction (click/tap) to enable sound
    const enableAudio = () => {
      isAudioAllowedRef.current = true;
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, { once: true });

    const q = query(collection(fireDB, "orders"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      const newNotifications = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newOrder = change.doc.data();
          const newOrderTimestamp = new Date(newOrder.date).getTime();

          if (lastNotifiedTimeRef.current && newOrderTimestamp <= lastNotifiedTimeRef.current) {
            return;
          }
          lastNotifiedTimeRef.current = newOrderTimestamp;

          let productDetails = "No products available";
          if (newOrder.cartItems?.length > 0) {
            productDetails = newOrder.cartItems
              .map((p, index) => `${index + 1}. ${p.title} (x${p.quantity})`)
              .join("\n");
          }

          const notificationMessage = {
            id: change.doc.id,
            message: `🛒 New Order!\n${productDetails}`,
          };

          newNotifications.push(notificationMessage);

          // ✅ Ensure audio plays only if user has interacted with the page
          const playSound = () => {
            if (isAudioAllowedRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((error) => {
                console.error("Audio Play Error:", error);
              });
            }
          };

          playSound(); // Try playing sound

          // ✅ Show Toast Notification
          toast.success(notificationMessage.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]);
      }
    });

    return () => unsubscribe();
  }, []);

  return { notifications, setNotifications };
};

export default useAdminNotifications;