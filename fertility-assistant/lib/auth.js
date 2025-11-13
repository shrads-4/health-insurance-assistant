import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase_config';

// Sign up a new user with email and password
export async function signUp(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: new Date(),
            ...userData
        });

        return { user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Sign in an existing user with email and password
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Sign in with Google
export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date()
            });
        }
        return { user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Sign out
export async function logOut() {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Listen to auth state changes
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}