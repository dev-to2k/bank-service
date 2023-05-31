import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEd5F5z6Ki3RKrqnAACTnBgsbdh4nyHGQ",
  authDomain: "bank-service-c4ed8.firebaseapp.com",
  databaseURL:
    "https://bank-service-c4ed8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bank-service-c4ed8",
  storageBucket: "bank-service-c4ed8.appspot.com",
  messagingSenderId: "1084772512394",
  appId: "1:1084772512394:web:992935c7546b56f56af373",
  measurementId: "G-S0274F14GF",
};

const app = initializeApp(firebaseConfig);

export default app;
