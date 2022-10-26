import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import Avatar from "../UIElements/Avatar";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = (
    <aside
      className={!props.show ? `side-drawer` : `side-drawer show-side-drawer`}
      onClick={props.onClick}
    >
      <nav
        className="main-navigation__drawer-nav"
        // style={auth.isLoggedIn ? { order: "3" } : null}
        style={props.style}
      >
        <NavLinks friendsBtn={props.friendsBtn}/>
      </nav>

      {props.auth ? (
        <div className={"side-drawer__btn"}>
          <button className="btn btn-sign_in" onClick={props.showAuthHandler}>
            Войти
          </button>
          <Link to="/signup" className="btn btn-sign_up">
            Регистрация
          </Link>
        </div>
      ) : (
        <Avatar
          className={"mobile-avatar"}
          image={props.image}
          alt={"avatar"}
          onClick={props.logOutHandler}
        />
      )}
    </aside>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
