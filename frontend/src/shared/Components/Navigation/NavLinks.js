import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./Navlinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <>
      {auth.isLoggedIn && (
        <p
          className={"header__nav-item"}
          style={{ cursor: "pointer" }}
          to={`/${auth.userId}/friends`}
          onClick={props.friendsBtn}
        >
          Мои друзья
        </p>
      )}

      {auth.isLoggedIn && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/english"
        >
          Английский
        </NavLink>
      )}
    </>
  );
};

export default NavLinks;
