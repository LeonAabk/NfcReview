import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

// Offentlig web-konfigurasjon for Firebase-prosjektet «smaksync» (ikke hemmelig).
const firebaseConfig = {
  apiKey: 'AIzaSyBqhHxR2alXm667KkJSJ8eiLxzsOLZui9U',
  authDomain: 'smaksync.firebaseapp.com',
  projectId: 'smaksync',
  storageBucket: 'smaksync.firebasestorage.app',
  messagingSenderId: '247220233955',
  appId: '1:247220233955:web:4dd3a6269394575f2347d6'
};

// Kun denne Google-kontoen får se og endre ordrer. Samme e-post står i firestore.rules.
export const ADMIN_EMAIL = 'aabakstudio@gmail.com';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function isAdminUser(user: User | null): boolean {
  return !!user && user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL;
}

export async function signInAdminWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account', login_hint: ADMIN_EMAIL });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export function signOutAdmin(): Promise<void> {
  return signOut(auth);
}

export function onAdminAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/** ID-token for innlogget admin, ellers null (vanlige kunder er aldri innlogget). */
export async function getAdminIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!isAdminUser(user)) return null;
  return user!.getIdToken();
}
