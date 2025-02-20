import { useState, useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import Todo from "./components/Todo";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  async function handleSignUp() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up", userCredential.user);
      setUser(userCredential.user);
    } catch (error) {
      console.log("Sign Up Error", error.message);
    }
    setEmail("");
    setPassword("");
  }

  async function handleSignIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in", userCredential.user);
      setUser(userCredential.user);
    } catch (error) {
      console.log("Sign in error", error.message);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Sign out error", error.message);
    }
    setUser(null);
    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user);
        setUser(user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <div className="form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter Your Email"
        />
        <label htmlFor="password">Password</label>

        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="Enter Password"
        />
        <button onClick={handleSignUp} className="signUp">
          Sign Up
        </button>
        <button onClick={handleSignIn} className="signIn">
          Sign In
        </button>
      </div>
    );
  }

  return <Todo onClickSignOut={handleSignOut} />;
}

export default App;
