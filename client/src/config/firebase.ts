import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwvpiymHV_AccptRKEKoymBRz3hNlz64M",
  authDomain: "lexica-591ff.firebaseapp.com",
  projectId: "lexica-591ff",
  storageBucket: "lexica-591ff.appspot.com",
  messagingSenderId: "54183709169",
  appId: "1:54183709169:web:362b2cbd93f4a792b3dc50"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
