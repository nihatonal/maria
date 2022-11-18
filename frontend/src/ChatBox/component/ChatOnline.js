import React from "react";

import test from "../../assets/images/denis.png";

import "./ChatOnline.css";
const ChatOnline = (props) => {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={test} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">john doe</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={test} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">john doe</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={test} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">john doe</span>
      </div>
    </div>
  );
};

export default ChatOnline;
