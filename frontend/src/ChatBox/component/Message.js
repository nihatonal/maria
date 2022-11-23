import React from "react";
import { format } from "timeago.js";
import test from "../../assets/images/denis.png";

import "./Message.css";
const Message = ({ message, own, owner, friend }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={
            own
              ? process.env.REACT_APP_ASSETS_URL + owner
              : process.env.REACT_APP_ASSETS_URL + friend
          }
          alt={own ? owner : friend}
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
