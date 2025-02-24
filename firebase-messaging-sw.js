importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBnVwO6pISPvO-vn9Plw4dCtP_rQ_htbh0",
    authDomain: "wa-notification-cc1b7.firebaseapp.com",
    projectId: "wa-notification-cc1b7",
    storageBucket: "wa-notification-cc1b7.firebasestorage.app",
    messagingSenderId: "844476483566",
    appId: "1:844476483566:web:b33e10cb2efa7970cdf0ff",
    measurementId: "G-1LQYNVED70"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const { phone, message } = payload.data;
    const cleanedPhone = phone.replace(/\D/g, ""); // Remove non-digits
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    const notificationTitle = "Time to Send Your Message!";
    const notificationOptions = {
        body: "Click here to open WhatsApp and send your scheduled message.",
        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        data: { url: whatsappUrl } // Store the URL in notification data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification
    const url = event.notification.data.url; // Get the WhatsApp URL from notification data

    // Open the URL in a new window/tab or focus an existing one
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if WhatsApp is already open
            for (let client of windowClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not open, create a new window/tab
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});