import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAn_YMkfYIrf60HYWTXlPGkN11OAyWIimM",
  authDomain: "alchemy-revamp.firebaseapp.com",
  projectId: "alchemy-revamp",
});

const db = getFirestore(app);

async function test() {
  console.log("Fetching blogs...");
  const snapshot = await getDocs(collection(db, "blogs"));
  console.log("Total blogs:", snapshot.docs.length);
  snapshot.docs.forEach(d => console.log(d.id, d.data().title, d.data().status));
  process.exit(0);
}
test().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
