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

// Global event listener for push events
self.addEventListener("push", (event) => {
    if (!event.data) {
        console.log("Push event but no data");
        return;
    }

    const payload = event.data.json();
    console.log("Push received: ", payload);

    const { phone, message } = payload.data || {};
    if (!phone || !message) return;

    const cleanedPhone = phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    const notificationTitle = "Time to Send Your Message!";
    const notificationOptions = {
        body: "Click here to open WhatsApp and send your scheduled message.",
        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        data: { url: whatsappUrl }
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data.url;
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
