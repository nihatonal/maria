import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";
import axios from "axios";
import Game from "../../MemoryGame/Game";
import Quiz from "../components/Quiz";
import "./English.css";
const English = () => {
  const auth = useContext(AuthContext);
  const userID = useParams().userId;
  const [loadedCars, setLoadedCars] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchWords = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${auth.userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.cars.reverse());
          setLoadedCars(res.data.cars.reverse());
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchWords();
  }, [userID,auth.userId]);
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
