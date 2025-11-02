// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    collection,
    setLogLevel
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- IMPORTANT ---
// This is your public Firebase configuration.
// This is safe to share in your JavaScript.
const firebaseConfig = {
  apiKey: "AIzaSyATegjKUFLM4bd4E0b-G0n6PIWNJ32dULA",
  authDomain: "kaju-kart-5617d.firebaseapp.com",
  projectId: "kaju-kart-5617d",
  storageBucket: "kaju-kart-5617d.firebasestorage.app",
  messagingSenderId: "353406818531",
  appId: "1:353406818531:web:cfb75dcb367c3064860dd6",
  measurementId: "G-N613QDVQDM"
};

// --- App ID (for database paths) ---
// This is a custom ID to organize our database
const appId = "kajukart-demo"; 

// --- Initialize Firebase ---
let app;
let auth;
let db;
let publicDataCollection;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    // Set Firestore log level for debugging
    setLogLevel('Debug');
    
    // --- Public Collection Reference ---
    // A single, shared reference to our public product data
    publicDataCollection = collection(db, `artifacts/${appId}/public/data/products`);
    
    console.log("Firebase Initialized Successfully (from config.js)");

} catch (error) {
    console.error("Error initializing Firebase (from config.js):", error);
    alert("FATAL ERROR: Could not connect to Firebase. App is unusable. " + error.message);
}

// --- Shared Authentication Logic ---

/**
 * Initializes authentication, signing in anonymously if no user is found.
 * Returns a promise that resolves when the auth state is confirmed.
 */
// FIXED: Corrected the function syntax from (). to () => {
const initializeAuth = () => {
	return new Promise((resolve, reject) => {
		// onAuthStateChanged returns an 'unsubscribe' function
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			unsubscribe(); // Stop listening after the first check
			if (!user) {
				try {
					console.log("No user found, signing in anonymously...");
					await signInAnonymously(auth);
					console.log("Signed in anonymously.");
					resolve(); // Resolve after anonymous sign-in
				} catch (error) {
					console.error("Anonymous sign-in failed:", error);
					reject(error); // Reject if anonymous sign-in fails
				}
			} else {
				console.log("User is already signed in.", user.uid);
				resolve(); // Resolve if user is already signed in
			}
		}, (error) => {
			// This error callback handles initialization errors
			console.error("onAuthStateChanged error:", error);
			reject(error);
		});
	});
};


// --- Export all the services ---
export { 
    app, 
    auth, 
    db, 
    appId, 
    publicDataCollection, 
    initializeAuth, 
    signInAnonymously // Export this in case we need it for sign-out
};

