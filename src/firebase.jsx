import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk-YdCi7Z4KSOMzQdYtzRY3I_xnhyPML4",
  authDomain: "mern-blogify.firebaseapp.com",
  projectId: "mern-blogify",
  storageBucket: "mern-blogify.appspot.com",
  messagingSenderId: "36741833805",
  appId: "1:36741833805:web:b57a37e2a6c246a64ea804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app