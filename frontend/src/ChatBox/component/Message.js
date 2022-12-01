import React from "react";
import { format } from "timeago.js";
import test from "../../assets/images/denis.png";

import "./Message.css";
const Message = ({ message, own, owner, friend }) => {
  var crypto = require("crypto");
  var cypherKey = "mySecretKey";
  function decrypt(text) {
    var decipher = crypto.createDecipher("aes-256-cbc", cypherKey);
    var dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec; //myPlainText
  }

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
        <p className="messageText">{decrypt(message.text)}</p>
      </div>
      <div className="messageBottom">
        {message && format(message.createdAt)}
      </div>
    </div>
  );
};

export default Message;
