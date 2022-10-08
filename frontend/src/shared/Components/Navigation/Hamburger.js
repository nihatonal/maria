import React from "react";

import "./Hamburger.css";

const Hamburger = (props) => {
  return (
    <div
      id="nav-icon"
      className={props.show ? "open" : ""}
      onClick={props.onClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
export default Hamburger;
