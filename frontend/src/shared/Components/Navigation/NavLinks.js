import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./Navlinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <>
      {/*  */}

      {/* {auth.isLoggedIn ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/rentacar"
          onClick={cleanLocalStorage}
        >
          Бронирования
        </NavLink>
      ) : (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/about"
        >
          О нас
        </NavLink>
      )} */}
      {/* {auth.isLoggedIn ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to={`/${auth.userId}/cards`}
          onClick={cleanLocalStorage}
        >
          Мои Карточки
        </NavLink>
      ) : (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/conditions"
        >
          Условия
        </NavLink>
      )} */}
      {/* {auth.isLoggedIn && (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to={`/${auth.userId}/mywords`}
        >
          Мои слова
        </NavLink>
      )} */}
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
          to={`/${auth.userId}/userplace`}
        >
          Мои Фото
        </NavLink>
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
      {/* {auth.isLoggedIn ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/english"
        >
          Английский
        </NavLink>
      ) : (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/faq"
        >
          Частые вопросы
        </NavLink>
      )} */}
    </>
  );
};

export default NavLinks;
