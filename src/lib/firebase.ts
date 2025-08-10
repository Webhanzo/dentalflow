// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ5kGrOQDPO3pVlbXCy57rEf7h1ae3uCI",
  authDomain: "dental-6b39d.firebaseapp.com",
  databaseURL: "https://dental-6b39d-default-rtdb.firebaseio.com",
  projectId: "dental-6b39d",
  storageBucket: "dental-6b39d.appspot.com",
  messagingSenderId: "318737516637",
  appId: "1:318737516637:web:5580bb9166395b4a6665b4",
  measurementId: "G-YHGG4BF9GZ"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
