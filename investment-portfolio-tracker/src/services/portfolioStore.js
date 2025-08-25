import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export function portfolioDocRef(uid) {
  return doc(db, "portfolios", uid); // one doc per user
}

// subscribe to assets
export function listenPortfolio(uid, cb) {
  return onSnapshot(portfolioDocRef(uid), (snap) => {
    const data = snap.data();
    cb(Array.isArray(data?.assets) ? data.assets : []);
  });
}

// save assets
export async function savePortfolio(uid, assets) {
  await setDoc(portfolioDocRef(uid), { assets }, { merge: true });
}
