import {getApp, getApps} from "firebase/app"
import {getStorage} from "firebase/storage"
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMWn-Xh6RNdVWhsiFdWjv1lbCbinsbpqM",
    authDomain: "job-portal-e9aa8.firebaseapp.com",
    projectId: "job-portal-e9aa8",
    storageBucket: "job-portal-e9aa8.firebasestorage.app",
    messagingSenderId: "868064413485",
    appId: "1:868064413485:web:50d3093a1c3985c05bb5a4"
  };
   
   const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
    
  const storage= getStorage(app);

  export { storage };
  
  
 // Use this function to get a reference to a file in your Firebase Storage