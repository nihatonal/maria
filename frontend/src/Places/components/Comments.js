import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AnimateHeight from "react-animate-height";
import { uuid } from "uuidv4";
import { DateCalc } from "../../shared/util/DateCalc";
import { AuthContext } from "../../shared/context/auth-context";

import { FiSend } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

import "./Comment.css";
const Comments = (props) => {
  const auth = useContext(AuthContext);
  const placeId = useParams().pid;
  const { sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!placeId) {
      const place = props.places.filter((place) => place.id === props.placeId);
      const place_comments = place[0].comments;
      setComments(place_comments);
    } else if (placeId) {
      const fetchCars = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
          );
          setComments(responseData.place.comments);
        } catch (err) {}
      };
      fetchCars();
    }
  }, [commentSubmit, deleteHandler]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  const setComment = async () => {
    let comment;
    let user;

    try {
      user = loadedUsers.filter((user) => user.id === props.user);
      comment = [
        { id: uuid(), comment: value, author: user, date: new Date() },
        ...comments,
      ];
      setComments(comment);
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/comments/${props.placeId}`,
        "PATCH",
        JSON.stringify({
          comments: comment,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        }
      );
      setHeight(0);
    } catch (err) {}
  };

  const deleteComment = async (id) => {
    let newComments;

    try {
      newComments = comments.filter((item) => item.id !== id);

      setComments(newComments);
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/comments/${props.placeId}`,
        "PATCH",
        JSON.stringify({
          comments: newComments,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        }
      );
    } catch (err) {}
  };

  const commentSubmit = (e) => {
    e.preventDefault();
    setComment();
    setValue("");
  };
  const deleteHandler = (e) => {
    e.preventDefault();
    // let user;
    // user = loadedUsers.filter((user) => user.id === props.user);

    deleteComment(e.target.id);
  };

  return (
    <div className="comment_container">
      {/* <div
        className="comment-btn"
        onClick={() => (height !== "auto" ? setHeight("auto") : setHeight(0))}
      >
        <FiMessageCircle />
        <p>Напишите комментарий...</p>
      </div> */}
      {/* <AnimateHeight
        id="example-panel"
        duration={500}
        height={height}
      > */}
      <div className={"comment-inputs_wrapper"}>
        <textarea
          value={value}
          placeholder={"Напишите комментарий..."}
          onChange={(e) => setValue(e.target.value)}
          className="comment_input"
        />
        <button
          onClick={commentSubmit}
          className="comment_send-btn"
          type={"submit"}
        >
          <FiSend />
        </button>
      </div>
      {/* </AnimateHeight> */}
      <div className="comment-items_wrapper">
        {/* <CarouselComments> */}
        {comments.map((comment) => (
          <div className="comment-item_wrapper" key={comment.id}>
            <NavLink
              to={`/user/${comment.author[0].id}/`}
              className="comment-item_author"
            >
              <img
                src={process.env.REACT_APP_ASSETS_URL + comment.author[0].image}
                alt={"as"}
              />
              <h4 className="comment-item_author-name">
                {comment.author[0].username}
              </h4>
              <p className="comment-item_date">
                {DateCalc(new Date(comment.date))}
              </p>
            </NavLink>
            <p className="comment-item_comment">{comment.comment}</p>
            {comment.author[0].id === auth.userId && (
              <div
                className="comment-delete-btn"
                onClick={deleteHandler}
                id={comment.id}
              >
                <FaRegTrashAlt className="comment-delete" />
              </div>
            )}
          </div>
        ))}
        {/* </CarouselComments> */}
      </div>
    </div>
  );
};

export default Comments;
