import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">

        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="login-logo">Re:Purpose</div>

        <h2>
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>

        <p>
          {isSignup
            ? "Start giving products a new purpose."
            : "Continue your sustainable journey."}
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

        </form>

        <button
          className="switch-login"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "New to Re:Purpose? Create an account"}
        </button>

      </div>
    </div>
  );
}

export default Login;