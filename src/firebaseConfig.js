import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2NeY2xrSV3O2t0R7TdIp8952CIK50-1M",
  authDomain: "personalblog-2297e.firebaseapp.com",
  projectId: "personalblog-2297e",
  storageBucket: "personalblog-2297e.appspot.com",
  messagingSenderId: "643421950460",
  appId: "1:643421950460:web:97a7e2f3eeb84f16f9e279",
  measurementId: "G-ZHQBK30XK8",
};

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { app, fireDb };
