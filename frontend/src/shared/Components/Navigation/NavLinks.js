import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./Navlinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const cleanLocalStorage = () => {
    localStorage.removeItem("carData");
    localStorage.removeItem("carOptions");
    localStorage.removeItem("initialImages");
    localStorage.removeItem("selectedCar");
    localStorage.removeItem("initialDocs");
    localStorage.removeItem("searchCity");
    localStorage.removeItem("searchItems");
    localStorage.removeItem("dateRanges");
  };

  return (
    <>
      {/*  */}

      {auth.isLoggedIn ? (
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
      )}
      {auth.isLoggedIn ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to={`/${auth.userId}/cars`}
          onClick={cleanLocalStorage}
        >
          Мои автомобили
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
      )}
      {auth.isLoggedIn ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? "header__nav-item is-active" : "header__nav-item"
          }
          to="/messages"
        >
          Сообщения
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
      )}
    </>
  );
};

export default NavLinks;
