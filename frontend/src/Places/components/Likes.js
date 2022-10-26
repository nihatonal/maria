import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { AiFillDislike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

import "./Likes.css";

const Likes = (props) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [userLikes, setUserLikes] = useState([]);
  const [userDisLikes, setUserDisLikes] = useState([]);
  const placeId = useParams().pid;

  const userId = auth.userId;

  useEffect(() => {
    if (!placeId) {
      const place = props.places.filter((place) => place.id === props.place);
      setUserLikes(place[0].likes);
      setUserDisLikes(place[0].dislikes);
    } else if (placeId) {
      const fetchCars = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
          );
          setUserLikes(responseData.place.likes);
          setUserDisLikes(responseData.place.dislikes);
        } catch (err) {}
      };
      fetchCars();
    }
  }, [placeId]);

  const setLikes = async () => {
    let likeArr = [],
      dislikeArr = [];

    if (!userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      likeArr = [...userLikes, userId];
      dislikeArr = userDisLikes;
    } else if (userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      likeArr = userLikes.filter((item) => item !== userId);
      dislikeArr = userDisLikes;
    } else if (!userLikes.includes(userId) && userDisLikes.includes(userId)) {
      likeArr = [...userLikes, userId];
      dislikeArr = userDisLikes.filter((item) => item !== userId);
    }
    let place = placeId ? placeId : props.place;
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${place}`,
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
      setUserLikes(likeArr);
      setUserDisLikes(dislikeArr);
    } catch (err) {}
  };

  const setDisLikes = async () => {
    let likeArr = [],
      dislikeArr = [];

    if (!userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      likeArr = userLikes;
      dislikeArr = [...userDisLikes, userId];
    } else if (!userLikes.includes(userId) && userDisLikes.includes(userId)) {
      likeArr = userLikes;
      dislikeArr = userDisLikes.filter((item) => item !== userId);
    } else if (userLikes.includes(userId) && !userDisLikes.includes(userId)) {
      likeArr = userLikes.filter((item) => item !== userId);
      dislikeArr = [...userDisLikes, userId];
    }
    let place = placeId ? placeId : props.place;
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${place}`,
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
      setUserLikes(likeArr);
      setUserDisLikes(dislikeArr);
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = (e) => {
    e.preventDefault();
    setLikes();
  };
  const dislikeHandler = (e) => {
    e.preventDefault();
    setDisLikes();
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
