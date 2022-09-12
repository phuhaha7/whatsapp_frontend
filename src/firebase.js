import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDMOCiaKTNBeRaQ3vD0ubsT3hG_Le48fAo",
    authDomain: "whatsapp-frontend-850cb.firebaseapp.com",
    projectId: "whatsapp-frontend-850cb",
    storageBucket: "whatsapp-frontend-850cb.appspot.com",
    messagingSenderId: "984829672347",
    appId: "1:984829672347:web:2a7977c98c6a8222a3bf3e"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider()

export { auth, provider };
export default db;
