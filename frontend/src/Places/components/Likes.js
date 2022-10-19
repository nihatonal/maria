import React, { useEffect, useContext, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth-context";
import { AiFillDislike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

import "./Likes.css";

const Likes = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [place, setPlace] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [userDisLikes, setUserDisLikes] = useState([]);

  const userId = auth.userId;

  useEffect(() => {
    const place = props.places.filter((place) => place.id === props.place);
    setPlace(place);
    setUserLikes(place[0].likes);
    setUserDisLikes(place[0].dislikes);
  }, [likeHandler, dislikeHandler]);

  const setLikes = async () => {
    let likeArr, dislikeArr;
    try {
      likeArr = [...place[0].likes, userId];
      setUserLikes(likeArr);
      dislikeArr = place[0].dislikes;
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.place}`,
        "PATCH",
        JSON.stringify({
          likes: likeArr,
          dislikes: dislikeArr,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const unsetLikes = async () => {
    let likeArr, dislikeArr;
    try {
      likeArr = place[0].likes.filter((item) => item !== userId);
      setUserLikes(likeArr);

      dislikeArr = place[0].dislikes;
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.place}`,
        "PATCH",
        JSON.stringify({
          likes: likeArr,
          dislikes: dislikeArr,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };
  const setDisLikes = async () => {
    let likeArr, dislikeArr;
    try {
      dislikeArr = [...place[0].dislikes, userId];
      setUserDisLikes(dislikeArr);
      likeArr = place[0].likes;
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.place}`,
        "PATCH",
        JSON.stringify({
          likes: likeArr,
          dislikes: dislikeArr,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const unsetDisLikes = async () => {
    let likeArr, dislikeArr;
    try {
      dislikeArr = place[0].dislikes.filter((item) => item !== userId);
      setUserDisLikes(dislikeArr);
      likeArr = place[0].likes;
    } catch {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.place}`,
        "PATCH",
        JSON.stringify({
          likes: likeArr,
          dislikes: dislikeArr,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const likeHandler = async (e) => {
    e.preventDefault();

    if (!userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      setLikes();
    }
    if (userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      unsetLikes();
    }
    if (!userLikes.includes(userId) && userDisLikes.includes(userId)) {
      setLikes();
      unsetDisLikes();
    }
  };
  const dislikeHandler = async (e) => {
    e.preventDefault();
    if (!userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      setDisLikes();
    }
    if (!userLikes.includes(userId) && userDisLikes.includes(userId)) {
      unsetDisLikes();
    }
    if (userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      setDisLikes();
      unsetLikes();
    }
  };

  return (
    <div className="place_item-likes">
      <button
        disabled={props.disabled}
        className={`like-btn`}
        onClick={likeHandler}
      >
        <AiFillLike
          className={userLikes.includes(userId) ? "activeLike" : ""}
        />
        {userLikes.length}
      </button>
      <button
        disabled={props.disabled}
        className="dislike-btn"
        onClick={dislikeHandler}
      >
        <AiFillDislike
          className={userDisLikes.includes(userId) ? "activeDislike" : ""}
        />

        {userDisLikes.length}
      </button>
    </div>
  );
};

export default Likes;
