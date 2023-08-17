import React, { useState } from "react";
import "./AddArticle.css";
import { auth, db, storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddArticle() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const categories = ["Health", "Food", "Travel", "Technology"];
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        paragraphOne: "",
        paragraphTwo: "",
        paragraphThree: "",
        category: "",
        imageURL: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create a reference for the submitted image
        const imageRef = ref(storage, `images/${formData.imageURL.name + v4()}`);
        
        // Upload the submitted image to the bucket
        uploadBytes(imageRef, formData.imageURL)
        .then(res => {
            // Get URL from the ref
            getDownloadURL(res.ref)
            .then(url => {
                // Now we have all the data and the URL
                // Create article reference
                const articleRef = collection(db, "articles");

                addDoc(articleRef, {
                    ...formData,
                    imageURL: url,
                    createdBy: user.displayName,
                    userId: user.uid,
                    createdAt: Timestamp.now().toDate()
                });
            })
            .catch(err => console.log(err));
        })
        .then(res => {
            toast("Article added successfully!", {type: "success", autoClose: 1500});

            // Pause before redirecting the user to HomePage
            setTimeout(() => {
                navigate("/");
            }, 1500)
        })
        .catch(err => console.log(err));
    }

  return (
    <div className="add-article-container">
      <form className="add-article-form" onSubmit={handleSubmit}>
        <h2>Create Article</h2>
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Maximum 100 characters"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            placeholder="Maximum 120 characters"
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="paragraphOne">Paragraph One</label>
          <textarea
            id="paragraphOne"
            placeholder="Maximum 650 characters"
            onChange={(e) =>
              setFormData({ ...formData, paragraphOne: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="paragraphTwo">Paragraph Two</label>
          <textarea
            id="paragraphTwo"
            placeholder="Maximum 650 characters"
            onChange={(e) =>
              setFormData({ ...formData, paragraphTwo: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="paragraphThree">Paragraph Three</label>
          <textarea
            id="paragraphThree"
            placeholder="Maximum 650 characters"
            onChange={(e) =>
              setFormData({ ...formData, paragraphThree: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select</option>
            {categories.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, imageURL: e.target.files[0] })
            }
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}