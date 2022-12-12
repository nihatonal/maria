import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./Navlinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <>
      {auth.isLoggedIn && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/messenger"
        >
          Messenger
        </NavLink>
      )}
    </>
  );
};

export default NavLinks;
