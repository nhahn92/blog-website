import React from "react";
import "./Header.css";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
// npm i react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Header() {
  // Get the user data
  const [user] = useAuthState(auth);

  const categories = ["Health", "Food", "Travel", "Technology"];

  const navigate = useNavigate();

  return (
    <div className="header-container">
        <FaHome
          className="nav-link"
          onClick={() => navigate("/")}
          style={{cursor: "pointer"}}
        />
        {
          user && <Link to="/addArticle" className="auth-link">Add Article</Link>
        }
        <div className="categories-container">
          {
            categories.map((item, index) => <Link to={`/category/${item}`} className="nav-link" key={index}>
              {item}
            </Link>)
          }
        </div>
        {user ? (
          <div>
            <span className="username">{user.displayName ? user.displayName : user.email}</span>
            <button className="auth-link" onClick={() => signOut(auth)}>Log Out</button>
          </div>
        ): (
          <Link className="auth-link" to={"/auth"}>Sign Up</Link>
        )}
    </div>
  )
}