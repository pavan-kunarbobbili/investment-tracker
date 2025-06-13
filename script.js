import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userEmail = document.getElementById("user-email");

document.getElementById("entry-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const reason = document.getElementById("reason").value;
  const type = document.getElementById("type").value;
  const user = auth.currentUser;

  if (user) {
    await addDoc(collection(db, "entries"), {
      uid: user.uid,
      email: user.email,
      date,
      amount,
      reason,
      type,
      addedAt: new Date().toISOString()
    });
    document.getElementById("entry-form").reset();
  }
});

function renderEntries(snapshot) {
  const list = document.getElementById("entry-list");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("li");
    item.textContent = `[${data.type}] ₹${data.amount} on ${data.date} — ${data.reason} (by ${data.email})`;
    list.appendChild(item);
  });
}

function login() {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .catch(console.error);
}

function signup() {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .catch(console.error);
}

function logout() {
  signOut(auth);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("main").style.display = "block";
    userEmail.textContent = user.email;

    const q = query(collection(db, "entries"), orderBy("date", "desc"));
    onSnapshot(q, renderEntries);
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("main").style.display = "none";
  }
});
