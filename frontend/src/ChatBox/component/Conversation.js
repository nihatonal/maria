import React from "react";

import test from '../../assets/images/denis.png'
import "./Conversation.css";

const Conversions = (props) => {
  return (
    <div className="conversation">
      <img src={test} alt="test" className="conversationImg" />
      <span className="conversationName"></span>
    </div>
  );
};

export default Conversions;
