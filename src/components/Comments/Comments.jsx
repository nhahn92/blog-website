import React, { useEffect, useState } from "react";
import "./Comments.css";
import { auth, db } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Comments({articleId}) {
    const [user] = useAuthState(auth);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);

    // Show all comments when the page loads
    useEffect(() => {
            // Get reference to comments collection
            const commentsRef = collection(db, "comments");

            // Get the comments
            // Filter to show comments for only this article
            const q = query(commentsRef, where("articleId", "==", articleId));

            // Can use onSnapshot instead of getDocs
            // onSnapshot "listens" for changes in the backend and automatically updates
            onSnapshot(q, (snapshot) => {
                // Convert to more readable array
                const comments = snapshot.docs.map(item => ({
                    ...item.data(),
                    id: item.id
                }));
                setComments(comments);
            });
        }, []);

    const addNewComment = e => {
        e.preventDefault();
        // Need to make a new document in comments collection
        // Include newComment, articleId, and the user who made it
        // Create a reference to the comments collection
        // Will create collection if doesn't exist
        const commentsRef = collection(db, "comments");

        // Add a document with this articleId and userId
        addDoc(commentsRef, {
            userId: user?.uid,
            articleId: articleId,
            content: newComment,
            username: user?.displayName
        })
        .then(() => {
            toast("Comment added successfully!", {type: "success", autoClose: 1500});
            setNewComment("");
        })
        .catch(err => console.log(err));
    };

    const deleteComment = id => {
        // Get the particular document
        deleteDoc(doc(db, "comments", id))
        .then(() => {
            toast("Comment deleted successfully!", {type: "success", autoClose: 1500});
        })
        .catch(err => console.log(err));
    };

  return (
    <div>
        <div className="comments-container">
            {
                comments.map(item =>
                    <div className="comment" key={item?.id}>
                        <p>
                            <span>{item?.username}</span>
                            {item?.content}
                        </p>
                        {/* Each comment has a uid
                        Compare to see if I'm the owner of the comment to delete it */
                        user?.uid === item.userId && <button onClick={() => deleteComment(item.id)}>Delete</button>
                        }
                    </div>
                )
            }
        </div>
        {user ? (
            <form onSubmit={addNewComment}>
                <input
                    type="text"
                    placeholder="Add comment"
                    onChange={e => setNewComment(e.target.value)}
                    value={newComment}
                />
                <button>Submit</button>
            </form>
        ) : (
            <p>Please log in to comment.</p>
        )}
    </div>
  )
}