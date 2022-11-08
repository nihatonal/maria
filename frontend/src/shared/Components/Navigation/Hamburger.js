import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";
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
