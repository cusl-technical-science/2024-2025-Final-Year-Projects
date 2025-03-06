import {getApp, getApps} from "firebase/app"
import {getStorage} from "firebase/storage"
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: ,
    authDomain: ,
    projectId: ,
    storageBucket: ,
    messagingSenderId: ,
    appId: 
  };
   
   const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
    
  const storage= getStorage(app);

  export { storage };
  
  
 // Use this function to get a reference to a file in your Firebase Storage
