import React from "react";
import "./Header.css";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const categories = ["Health", "Food", "Travel", "Technology"];

  const navigate = useNavigate();

  return (
    <div className="header-container">
        <FaHome className="nav-link" onClick={() => navigate("/")} />
        <div className="categories-container">
          {
            categories.map((item, index) => <Link to={`/category/${item}`} className="nav-link" key={index}>
              {item}
            </Link>)
          }
        </div>
    </div>
  )
}