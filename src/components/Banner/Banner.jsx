import React, { useEffect, useState } from "react";
import "./Banner.css";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function Banner() {
    // Two states to store the database articles
    const [mainArticle, setMainArticle] = useState({});
    const [otherArticles, setOtherArticles] = useState([]);

    // Get data when Banner mounts
    useEffect (
        () => {
            // Create variable to reference articles collection
            const articlesRef = collection(db, "articles");

            // Set up query to filter responses
            // Sort and then get the first five articles
            const q = query(articlesRef, orderBy("createdAt", "desc"), limit(5))

            // Get the data now
            // Functions similarly to an axios call by returning a Promise
            // Put the query in front of the database
            getDocs(q, articlesRef)
            .then(res => {
                // The response is extremely complicated with lots of irrelevant information
                // console.log(res.docs[0].data());

                // Map over the returned database to create a collection of objects
                // The ID is in a different place, so this simplifies it
                // "Cleaning the data"
                const articles = res.docs.map(item => {
                    return {
                        ...item.data(),
                        id: item.id,
                    }
                })
                setMainArticle(articles[0]);
                setOtherArticles(articles.splice(1));
            })
            .catch(err => console.log(err));
        }, []
    );

  return (
    <div className="banner-container">
        <div
            className="main-article-container"
            key={mainArticle?.id}
            style={{backgroundImage: `url(${mainArticle?.imageURL})`}}
        >
            <div className="banner-info">
                <h2>{mainArticle?.title}</h2>
                <div className="main-article-info">
                    <p>{mainArticle?.createdAt?.toDate().toDateString()}</p>
                </div>
            </div>
        </div>
        <div className="other-articles-container">
            {otherArticles.map((item) => (
                <div
                    className="other-article-item"
                    key={item?.id}
                    style={{backgroundImage: `url(${item?.imageURL})`}}
                >
                    <div className="banner-info">
                        <h3>{item?.title}</h3>
                        <div className="other-article-info">
                            <p>{item?.createdAt?.toDate().toDateString()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}