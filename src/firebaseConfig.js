// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPumzjMrZkFvSpP-9KDYN14tMaMG2Atds",
  authDomain: "youthxhack-2k24-team14.firebaseapp.com",
  projectId: "youthxhack-2k24-team14",
  storageBucket: "youthxhack-2k24-team14.appspot.com",
  messagingSenderId: "1040093037174",
  appId: "1:1040093037174:web:d095aa501e93f86c8d5557"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
