import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_-XDDIJ0Rbqwc1Q4rPYNf2g5-FNAgxHo",
  authDomain: "show-dont-tell-966f9.firebaseapp.com",
  projectId: "show-dont-tell-966f9",
  storageBucket: "show-dont-tell-966f9.appspot.com",
  messagingSenderId: "285802266558",
  appId: "1:285802266558:web:e303285f222c0c3919c3ef",
  measurementId: "G-0X3H47N9C5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

interface loginProps {
  username: string;
  password: string;
}

export async function Auth(props: loginProps) {
  const password = props.password + process.env.REACT_APP_AUTH_PASSWORD_SUFFIX;
  const result = await signInWithEmailAndPassword(
    auth,
    props.username,
    password
  )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  return result;
}
