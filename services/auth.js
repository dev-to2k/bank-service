import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "../firebaseConfig";

const auth = getAuth(app);

const authApi = {
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return user;
    } catch (error) {
      return error;
    }
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return user;
    } catch (error) {
      return error;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return false;
    }
  },
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  },
};

export default authApi;
