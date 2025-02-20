import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy, limit, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from "../../src/audio.mp3";

const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);
  const isAudioAllowedRef = useRef(false);
  const lastNotifiedTimeRef = useRef(
    Number(localStorage.getItem("lastNotifiedTimestamp")) || 0
  ); // ✅ Load last timestamp from storage

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.load();

    const enableAudio = () => {
      isAudioAllowedRef.current = true;
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, { once: true });

    const fetchLastOrderTimestamp = async () => {
      try {
        const latestOrderQuery = query(
          collection(fireDB, "orders"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const latestOrderSnapshot = await getDocs(latestOrderQuery);
        if (!latestOrderSnapshot.empty) {
          const latestOrder = latestOrderSnapshot.docs[0].data();
          const latestTimestamp = latestOrder.createdAt?.seconds
            ? latestOrder.createdAt.seconds * 1000
            : new Date().getTime();

          // ✅ Update lastNotifiedTimeRef BEFORE setting up the snapshot listener
          lastNotifiedTimeRef.current = latestTimestamp;
          localStorage.setItem("lastNotifiedTimestamp", latestTimestamp.toString());
        }
      } catch (error) {
        console.error("⚠️ Error fetching last order timestamp:", error);
      }
    };

    fetchLastOrderTimestamp().then(() => {
      // ✅ Set up Firestore listener *after* fetching latest order
      const q = query(collection(fireDB, "orders"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("📢 Firestore Snapshot Triggered!", snapshot.docs.length);

        if (snapshot.empty) {
          console.warn("⚠️ No new orders detected!");
          return;
        }

        const newNotifications = [];

        snapshot.docChanges().forEach((change) => {
          console.log(`📜 Change detected: ${change.type}`, change.doc.data());

          if (change.type === "added") {
            const newOrder = change.doc.data();
            const newOrderTimestamp = newOrder.createdAt?.seconds
              ? newOrder.createdAt.seconds * 1000
              : new Date().getTime();

            // ✅ Ensure order is newer than the last notified one
            if (newOrderTimestamp <= lastNotifiedTimeRef.current) {
              console.log("⏳ Old order detected, skipping...");
              return;
            }

            lastNotifiedTimeRef.current = newOrderTimestamp;
            localStorage.setItem("lastNotifiedTimestamp", newOrderTimestamp.toString());

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

            const playSound = () => {
              if (isAudioAllowedRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((error) => {
                  console.warn("⚠️ Audio Play Error:", error);
                });
              } else {
                console.warn("⚠️ Audio not allowed yet, waiting for user interaction...");
              }
            };

            playSound();

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
    });
  }, []);

  return { notifications, setNotifications };
};

export default useAdminNotifications;
