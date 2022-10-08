import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import Hangman from "../components/Hangman";
import Quiz from "../components/Quiz";
import "./English.css";
const English = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="english-container">
      <div className="english-navbar">
        <NavLink
          className={"english-navbar-item"}
          to={`/${auth.userId}/mywords`}
        >
          Мои слова
        </NavLink>
        <NavLink className={"english-navbar-item"} to={`/${auth.userId}/cards`}>
          Мои Карточки
        </NavLink>
        <NavLink
          className={"english-navbar-item"}
          to={`/${auth.userId}/hangman`}
        >
          Hangman
        </NavLink>
      </div>
      <Quiz />
      {/* <Hangman /> */}
    </div>
  );
};

export default English;
