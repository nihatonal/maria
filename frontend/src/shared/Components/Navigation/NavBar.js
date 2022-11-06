import React from "react";
import { NavLink } from "react-router-dom";

import { GiThreeFriends } from "react-icons/gi";
import { GiPostStamp } from "react-icons/gi";
import { GiBrickWall } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { MdOutlineHome } from "react-icons/md";

import "./NavBar.css";
const NavBar = (props) => {
  const { userId } = props;
  return (
    <div className="navbar">
      <NavLink className="nav homepage" to="/main">
        <MdOutlineHome />
      </NavLink>
      <NavLink className="nav user-wall" to={`/user/${userId}`}>
        <ImProfile />
      </NavLink>
      <NavLink className="nav user-friends" to={`/${userId}/friends`}>
        <GiThreeFriends />
      </NavLink>
    </div>
  );
};

export default NavBar;
