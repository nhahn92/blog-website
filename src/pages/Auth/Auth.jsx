import React, { useState } from "react";
import "./Auth.css";
import { auth } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [existingUser, setExistingUser] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
            // Add name as displayName
            updateProfile(auth.currentUser, {displayName: name});
            // Return to HomePage after signing up
            navigate("/");
        })
        .catch(err => console.log(err))
    }

    const handleLogin = (e) => {
        e.preventDefault();
        
        signInWithEmailAndPassword(auth, email, password)
        .then(res => {
            // Return to HomePage after logging in
            navigate("/");
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="auth-container">
        {
            existingUser ? (
                <form className="auth-form" onSubmit={handleLogin}>
                    <h1>Log in with your email</h1>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <span className="form-link" onClick={() => setExistingUser(false)}>Sign Up</span></p>
                </form>
            ) : (
                <form className="auth-form" onSubmit={handleSignup}>
                    <h1>Sign up with your email</h1>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                    <p>Already have an account? <span className="form-link" onClick={() => setExistingUser(true)}>Log In</span></p>
                </form>
            )}
    </div>
  )
}