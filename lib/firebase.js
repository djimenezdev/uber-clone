import * as firebase from "firebase";
import {
  FIREBASE_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE,
  FIREBASE_MESSAGING,
  FIREBASE_APP,
  FIREBASE_MEASUREMENT,
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE,
  messagingSenderId: FIREBASE_MESSAGING,
  appId: FIREBASE_APP,
  measurementId: FIREBASE_MEASUREMENT,
};

if (!firebase.apps.length) {
  firebase?.initializeApp(firebaseConfig);
}

const db = firebase?.firestore();

export { db };
