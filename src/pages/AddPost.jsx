import React, { useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addDoc, collection, doc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const addPost = () => {
    dispatch({ type: "showLoading" });
    const storage = getStorage();
    const storageRef = ref(storage, `/posts/${image.name}`);
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        getDownloadURL(ref(storage, `/posts/${image.name}`)).then((url) => {
          addDoc(collection(fireDb, "posts"), {
            description,
            imageURL: url,
            likes: [],
            comments: [],
            user: JSON.parse(localStorage.getItem("Blog-user")),
          })
            .then(() => {
              toast.success("Post created successfully");
              dispatch({ type: "hideLoading" });
              navigate("/");
            })
            .catch(() => {
              dispatch({ type: "hideLoading" });
              toast.error("something went wrong");
            });
        });
      })
      .catch(() => {
        toast.error("Error Uploading");
      });
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <DefaultLayout>
      <div>
        <h1 className="text-3xl text-gray-600">Add New Post</h1>

        <div className="w-screen flex flex-col">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-dashed border-gray-500 border-2 w-1/2 md:w-full my-5 p-5 "
            rows="3"
          ></textarea>

          <input type="file" onChange={(e) => onImageChange(e)} />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="mt-5 h-52 w-52 rounded"
            />
          )}
        </div>

        {description && image && (
          <button
            className=" mt-10 bg-primary h-10 rounded-sm px-10 text-white  "
            onClick={addPost}
          >
            Add
          </button>
        )}
      </div>
    </DefaultLayout>
  );
}

export default AddPost;
