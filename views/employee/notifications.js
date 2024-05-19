// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvnZkbqON0vsIackr90txDbg-oYj_ikJ0",
  authDomain: "staff-relations-databases.firebaseapp.com",
  databaseURL: "https://staff-relations-databases-default-rtdb.firebaseio.com",
  projectId: "staff-relations-databases",
  storageBucket: "staff-relations-databases.appspot.com",
  messagingSenderId: "356187917991",
  appId: "1:356187917991:web:e2cd5bd697464c873a9582",
  measurementId: "G-42THPFZ5QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get references to the notification lists
const newNotificationsRef = ref(db, 'notifications/new');
const archivedNotificationsRef = ref(db, 'notifications/archived');

// Get reference to the new notifications list
onValue(newNotificationsRef, (snapshot) => {
  const notifications = snapshot.val();
  const newNotificationsList = document.getElementById('newNotifications');
  newNotificationsList.innerHTML = '';

  if (notifications) {
    Object.keys(notifications).forEach((key) => {
      const notification = notifications[key];
      const listItem = document.createElement('li');
      listItem.classList.add('unread');
      listItem.textContent = notification.message;

      const archiveButton = document.createElement('button');
      archiveButton.textContent = 'Archive';
      archiveButton.addEventListener('click', () => {
        archiveNotification(key, notification);
      });

      listItem.appendChild(archiveButton);
      newNotificationsList.appendChild(listItem);
    });
  }
});

// Get reference to the archived notifications list
onValue(archivedNotificationsRef, (snapshot) => {
  const notifications = snapshot.val();
  const archivedNotificationsList = document.getElementById('archivedNotifications');
  archivedNotificationsList.innerHTML = '';

  if (notifications) {
    Object.keys(notifications).forEach((key) => {
      const notification = notifications[key];
      const listItem = document.createElement('li');
      listItem.textContent = notification.message;
      archivedNotificationsList.appendChild(listItem);
    });
  }
});

// Function to archive a notification
function archiveNotification(key, notification) {
  // Remove the notification from the new list
  const newNotificationsRef = ref(db, `notifications/new/${key}`);
  remove(newNotificationsRef);

  // Add the notification to the archived list
  const archivedNotificationsRef = ref(db, `notifications/archived`);
  push(archivedNotificationsRef, notification);
}