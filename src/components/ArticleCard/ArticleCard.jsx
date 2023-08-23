import React from "react";
import "./ArticleCard.css";
import { Link } from "react-router-dom";

export default function ArticleCard({article}) {
  return (
    <div className="article-card">
        <img src={article?.imageURL} alt={article?.title} />
        <div className="article-card-info">
          <p>{article?.title}</p>
          <Link to={`/article/${article?.id}`}>Read</Link>
        </div>
    </div>
  )
}