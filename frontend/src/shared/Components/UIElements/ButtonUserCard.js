import React from "react";

import "./ButtonUserCard.css";
function ButtonUserCard(props) {
  return (
    <button className="btn-usercard-wrapper" onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default ButtonUserCard;
