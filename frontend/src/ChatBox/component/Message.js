import React from "react";

import test from "../../assets/images/denis.png";

import "./Message.css";
const Message = ({ own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src={test} alt="" className="messageImg" />
        <p className="messageText">
          Lorem ipsum dolor sit amet, consectetur adip
        </p>
      </div>
      <div className="messageBottom">1 hour ago</div>
    </div>
  );
};

export default Message;
