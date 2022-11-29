import React, { useState, useEffect } from "react";
import axios from "axios";
import test from "../../assets/images/denis.png";
import "./Conversation.css";

const Conversions = ({ conversation, currentUser,online }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios(
          process.env.REACT_APP_BACKEND_URL + "/users/" + friendId
        );
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversation">
      <div className="chatOnlineImgContainer">
        <img
          src={process.env.REACT_APP_ASSETS_URL + `${user && user.image}`}
          alt="test"
          className="conversationImg"
        />
        {online && <div className="chatOnlineBadge"></div>}
      </div>
      <span className="conversationName">{user && user.username}</span>
    </div>
  );
};

export default Conversions;
