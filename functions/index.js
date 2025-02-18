const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

exports.notifyAdminOnNewOrder = functions.firestore
  .document("orders/{orderId}") // Listen for new orders
  .onCreate(async (snapshot, context) => {
    const orderData = snapshot.data();
    
    // Define Admin Notification Token (Replace with your admin FCM token)
    const adminToken = "eYxqD0nhThQ3PylWBOk2_5:APA91bE-3immRU35H_AymruhRRc5ttG65U202pUB0O_Fy_NK_t6JsPN723NHE1-re-ccMg9r_lOdFbvPihuBYrhNN-RGE7YWM5biociyiOjTZm4no9Dqba8";

    // Construct the notification message
    const message = {
      notification: {
        title: "New Food Order Received!",
        body: `Order from ${orderData.customerName}, Total: $${orderData.totalPrice}`,
      },
      token: adminToken,
    };

    // Send Push Notification to Admin
    try {
      await messaging.send(message);
      console.log("Admin notified of new order!");
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    return null;
  });
