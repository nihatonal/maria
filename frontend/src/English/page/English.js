import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Game from "../../MemoryGame/Game";
import Quiz from "../components/Quiz";
import "./English.css";
const English = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="english-container">
      <div className="english-navbar">
        <NavLink
          className={"english-navbar-item"}
          to={`/english/${auth.userId}/mywords`}
        >
          Мой словарь
        </NavLink>
        <NavLink className={"english-navbar-item"} to={`/${auth.userId}/cards`}>
          Карточки
        </NavLink>
        <NavLink
          className={"english-navbar-item"}
          to={`/${auth.userId}/hangman`}
        >
          Hangman
        </NavLink>
      </div>
      <Game token={auth.token} userId={auth.userId} />
      <Quiz />

      {/* <Hangman /> */}
    </div>
  );
};

export default English;
