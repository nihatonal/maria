import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";
import "./Hamburger.css";

const Hamburger = (props) => {
  return (
    <div className={"mobile_btns_wrapper"} style={props.style}>
      {props.auth && (
        <NavLink to="/main">
          <MdOutlineHome onClick={props.homeicon} />
        </NavLink>
      )}
      <div
        id="nav-icon"
        className={props.show ? "open" : ""}
        onClick={props.onClick}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
export default Hamburger;
