import React, { useEffect, useState } from "react";
import "./Likes.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { auth, db } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

export default function Likes({articleId}) {
    const [user] = useAuthState(auth);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        // Did this user like this article?
        const likesRef = collection(db, "likes");
        
        if (user) {
            // Make a query to see if liked
            const q = query(
                likesRef,
                where("articleId", "==", articleId),
                where("userId", "==", user?.uid)
            );

            // Look for a matching document
            getDocs(q, likesRef)
            .then(res => {
                // If there is a match
                if (res.size > 0) {
                    setIsLiked(true);
                }
            })
            .catch(err => console.log(err));
        }
    }, [user])

    useEffect(() => {
        // Find out the like count for this article
        // Make a query to count likes
        const likesRef = collection(db, "likes");
        const q2 = query(likesRef, where("articleId", "==", articleId));

        // Look for matching documents
        getDocs(q2, likesRef)
        .then(res => {
            setLikesCount(res.size);
        })
        .catch(err => console.log(err));
    }, [isLiked])

    const handleLike = e => {
        // Check if user is logged in
        if (user) {
            // Create a reference to the likes collection
            // If the collection doesn't exist, it'll create it
            const likesRef = collection(db, "likes");

            // Add a document with this articleId and userId
            addDoc(likesRef, {
                userId: user?.uid,
                articleId: articleId
            })
            .then(() => setIsLiked(true))
            .catch(err => console.log(err))
        }
    }

    const handleUnlike = e => {
        // Check if user is logged in
        if (user) {
            // Need to find document with this articleId and userId
            // to get its document id
            const likesRef = collection(db, "likes");

            // Set up a query to find id of the record to delete
            const q = query(
                likesRef,
                where("articleId", "==", articleId),
                where("userId", "==", user?.uid)
            );

            // Get match
            getDocs(q, likesRef)
            .then(res => {
                const likedId = res.docs[0].id;

                // Now delete this document from likes collection
                deleteDoc(doc(db, "likes", likedId))
                .then(() => setIsLiked(false))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    }

  return (
    <div>
        {isLiked ? (
            < FaHeart onClick={handleUnlike} style={{cursor: "pointer"}} />
        ) : (
            < FaRegHeart onClick={handleLike} style={{cursor: "pointer"}} />
        )}
        {" "} {likesCount}
    </div>
  )
}