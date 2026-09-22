import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB7YTDtS5Uyetoh4X08QDkEAebRbH1BaCk',
  authDomain: 'harikascript.firebaseapp.com',
  projectId: 'harikascript',
  storageBucket: 'harikascript.firebasestorage.app',
  messagingSenderId: '728900819773',
  appId: '1:728900819773:web:a7c221c180f97139b04354',
  measurementId: 'G-XWR2H21W9L'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
export const isFirebaseConfigured = true;
