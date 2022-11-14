import React from "react";
import { NavLink } from "react-router-dom";
import Hamburger from "./Hamburger";
import { GiThreeFriends } from "react-icons/gi";

import { ImProfile } from "react-icons/im";
import { MdOutlineHome } from "react-icons/md";
import { MdPersonSearch } from "react-icons/md";
import { MdOutlineMenuBook } from "react-icons/md";

import "./NavBar.css";
const NavBar = (props) => {
  const { userId } = props;
  return (
    <div
      className="navbar"
      style={
        props.auth
          ? { gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr" }
          : { gridTemplateColumns: "1fr 1fr 1fr 1fr" }
      }
    >
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav active-nav-item" : "nav homepage"
        }
        to="/main"
        onClick={props.closeSideDrawer}
      >
        <MdOutlineHome />
      </NavLink>

      {props.auth && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav active-nav-item" : "nav homepage"
          }
          to={`/user/${userId}`}
          onClick={props.closeSideDrawer}
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
          onClick={props.closeSideDrawer}
        >
          <GiThreeFriends />
        </NavLink>
      )}
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav active-nav-item" : "nav homepage"
        }
        to={`/english/${userId}`}
        onClick={props.closeSideDrawer}
      >
        <MdOutlineMenuBook />
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav active-nav-item" : "nav homepage"
        }
        to="/users"
        onClick={props.closeSideDrawer}
      >
        <MdPersonSearch />
      </NavLink>
      <Hamburger
        show={props.drawerIsOpen}
        onClick={props.openDrawerHandler}
        auth={props.auth}
      />
    </div>
  );
};

export default NavBar;
