import React from "react";
import { NavLink } from "react-router-dom";
import Hamburger from "./Hamburger";
import { GiThreeFriends } from "react-icons/gi";

import { ImProfile } from "react-icons/im";
import { MdOutlineHome } from "react-icons/md";
import { MdPersonSearch } from "react-icons/md";

import "./NavBar.css";
const NavBar = (props) => {
  const { userId } = props;
  return (
    <div
      className="navbar"
      style={
        props.auth
          ? { gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }
          : { gridTemplateColumns: "1fr 1fr 1fr" }
      }
    >
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav active-nav-item" : "nav homepage"
        }
        to="/users"
      >
        <MdPersonSearch />
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav active-nav-item" : "nav homepage"
        }
        to="/main"
      >
        <MdOutlineHome />
      </NavLink>
      {props.auth && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav active-nav-item" : "nav homepage"
          }
          to={`/user/${userId}`}
        >
          <ImProfile />
        </NavLink>
      )}
      {props.auth && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav active-nav-item" : "nav homepage"
          }
          to={`/${userId}/friends`}
        >
          <GiThreeFriends />
        </NavLink>
      )}
      <Hamburger
        show={props.drawerIsOpen}
        onClick={props.openDrawerHandler}
        auth={props.auth}
      />
    </div>
  );
};

export default NavBar;
