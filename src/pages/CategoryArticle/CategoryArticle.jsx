import React, { useEffect, useState } from "react";
import "./CategoryArticle.css";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function CategoryArticle() {
  const [articles, setArticles] = useState([]);

  const { categoryName } = useParams();

  useEffect(
    () => {
      // Create variable to reference articles collection
      const articlesRef = collection(db, "articles");

      // Create query to get articles of the matching category
      const q = query(articlesRef, where("category", "==", categoryName));

      // Get data that matches the query
      getDocs(q, articlesRef)
      .then(res => {
        const articles = res.docs.map(item => {
            return {
                ...item.data(),
                id: item.id,
            }
        })
        setArticles(articles);
      })
      .catch(err => console.log(err))
    }, [categoryName]
  )

  return (
    <div>
      {articles.map(item => <p key={item?.id}>{item?.title}</p>)}
    </div>
  )
}