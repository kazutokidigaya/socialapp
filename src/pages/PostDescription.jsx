import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { useParams } from "react-router-dom";
import { fireDb } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineClose,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { getMetadata } from "firebase/storage";
import moment from "moment";

function PostDescription() {
  const currentUser = JSON.parse(localStorage.getItem("Blog-user"));
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showLikes, setShowLikes] = useState(false);
  const [post, setPost] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getUserName = (text) => {
    const email = text;
    const username = email.substring(0, email.length - 10);
    return username;
  };

  const getData = () => {
    dispatch({ type: "showLoading" });
    getDoc(doc(fireDb, "posts", params.id))
      .then((response) => {
        setPost({ ...response.data(), id: response.id });
        if (response.data().likes.find((user) => user.id === currentUser.id)) {
          setAlreadyLiked(true);
        } else {
          setAlreadyLiked(false);
        }
        dispatch({ type: "hideLoading" });
      })
      .catch(() => {
        dispatch({ type: "hideLoading" });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const likeorUnlikePost = () => {
    let updatedlikes = post.likes;

    if (alreadyLiked) {
      updatedlikes = post.likes.filter((user) => user.id !== currentUser.id);
    } else {
      updatedlikes.push({
        id: currentUser.id,
        email: currentUser.email,
      });
    }

    setDoc(doc(fireDb, "posts", post.id), { ...post, likes: updatedlikes })
      .then(() => {
        getData();
        toast.success("Post liked successfully");
      })
      .catch(() => {
        toast.error("an Error occured");
      });
  };

  const addComment = () => {
    let updatedComments = post.comments;

    updatedComments.push({
      id: currentUser.id,
      email: currentUser.email,
      commentText,
      createdOn: moment().format("DD-MM-YYYY"),
    });

    setDoc(doc(fireDb, "posts", post.id), {
      ...post,
      comments: updatedComments,
    })
      .then(() => {
        getData();
        setCommentText("");
      })
      .catch(() => {
        toast.error("an Error occured");
      });
  };

  return (
    <DefaultLayout>
      <div className="flex w-full justify-center space-x-5">
        {post && (
          <>
            {/*likes display*/}
            {showLikes && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Liked By
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowLikes(false)}
                  />
                </div>
                <hr />
                {post.likes.map((like) => {
                  return (
                    <div className="flex items-center card-sm p-2 mt-2 ">
                      <div className="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2">
                        <span className="text-2xl">
                          {getUserName(like.email)[0]}
                        </span>
                      </div>
                      <span>{getUserName(like.email)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/*post info*/}
            <div className="cursor-pointer h-[550px] w-[550px]">
              <div className="flex items-center card-sm p-2 ">
                <div className="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2">
                  <span className="text-2xl">
                    {getUserName(post.user.email)[0]}
                  </span>
                </div>
                <span>{getUserName(post.user.email)}</span>
              </div>

              <div className="w-full text-center flex justify-center card-sm ">
                <img src={post.imageURL} alt="" className="h-full w-full" />
              </div>
              <div className="card-sm p-2 flex w-full items-center space-x-5">
                <div className="flex space-x-2 items-center">
                  <AiFillHeart
                    color={alreadyLiked ? "red" : "gray"}
                    size={25}
                    onClick={likeorUnlikePost}
                  />
                  <h1
                    onClick={() => setShowLikes(true)}
                    className="underline font-semibold cursor-pointer"
                  >
                    {post.likes.length}
                  </h1>
                </div>

                <div className="flex space-x-2 items-center">
                  <AiOutlineComment size={25} />
                  <h1
                    className="underline text-xl cursor-pointer"
                    onClick={() => setShowComments(true)}
                  >
                    {post.comments.length}
                  </h1>
                </div>
                <div>
                  <AiOutlineShareAlt
                    onClick={() => navigate(`/sharepost/${post.id}`)}
                    size={25}
                    color="gray"
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/*comments display*/}
            {showComments && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Comments
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowComments(false)}
                  />
                </div>
                <div className="flex flex-col">
                  {post.comments.map((comment) => {
                    return (
                      <div className="card-sm mt-2 p-2">
                        <h1 className="text-xl text-gray-700">
                          {comment.commentText}
                        </h1>
                        <hr />
                        <h1 className="text-right text-md">
                          By <b>{getUserName(comment.email)}</b> On{" "}
                          {comment.createdOn}
                        </h1>
                      </div>
                    );
                  })}

                  <textarea
                    className="border-dashed border-gray-500 border-2  md:w-full my-5 p-5 w-full "
                    rows="2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button
                    className=" mt-2 bg-primary h-10 rounded-sm px-5 text-white w-20 text-center"
                    onClick={addComment}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default PostDescription;
