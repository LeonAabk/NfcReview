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

// Kun disse Google-kontoene får se og endre ordrer. Bruker-ID (uid) i stedet for e-post,
// så private e-poster ikke står i offentlig kode. Samme liste står i firestore.rules (SmakSync).
// Finn ID-en under Firebase-konsollen → Authentication → Users, eller i admin etter innlogging.
export const ADMIN_UIDS: string[] = [];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function isAdminUser(user: User | null): boolean {
  return !!user && ADMIN_UIDS.includes(user.uid);
}

export async function signInAdminWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
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
