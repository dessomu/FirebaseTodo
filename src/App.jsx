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
  const [error, setError] = useState("");


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
      setError(error.message.substring(10, error.message.length));
    }
    setEmail("");
    setPassword("");

    if (email === "" || password === "") {
      setError("Please fill all the fields");
    }
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
      setError(error.message.substring(10, error.message.length));
    }

    if (email === "" || password === "") {
      setError("Please fill all the fields");
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
      
    }
    setUser(null);
    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user);
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
        {error? <div className="error-modal">{error}<button onClick={()=>setError("")} style={{background:"green",width:"50px"}}>Ok!</button></div> : null}
      </div>
    );
  }

  return <Todo onClickSignOut={handleSignOut} />;
}

export default App;
