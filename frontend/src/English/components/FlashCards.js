import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";
import axios from "axios";

import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { GiPaperArrow } from "react-icons/gi";
import { GiReturnArrow } from "react-icons/gi";
import "./FlashCards.css";

const FlashCards = (props) => {
  const auth = useContext(AuthContext);
  const userID = useParams().userId;
  const [loadedCars, setLoadedCars] = useState();
  const [loading, setLoading] = useState(false);

  const [sideFront, setSideFront] = useState(true);
  const [sideBack, setSideBack] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  //const userId = auth.userId;

  useEffect(() => {
    setLoading(true);
    const fetchPlaces = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userID}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoadedCars(res.data.cars);
          setLoading(false);
          setSelectedCard(
            res.data.cars.length > 0 ? getRandomInt(0, res.data.cars.length) : 0
          );
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchPlaces();
  }, [userID]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const flashcardHandler = () => {
    setSideFront(!sideFront);
    setSideBack(!sideBack);
  };
  const nextHandler = () => {
    if (!loadedCars) return;
    if (selectedCard < loadedCars.length - 1) {
      setTimeout(() => {
        setSelectedCard(selectedCard + 1);
      }, 300);
    }
    setSideFront(true);
    setSideBack(false);
  };
  const previousHandler = () => {
    if (!loadedCars) return;
    if (selectedCard > 0) {
      setTimeout(() => {
        setSelectedCard(selectedCard - 1);
      }, 500);
    }
    setSideFront(true);
    setSideBack(false);
  };
  const randomCardHandler = () => {
    if (!loadedCars) return;
    setTimeout(() => {
      setSelectedCard(loadedCars && getRandomInt(0, loadedCars.length));
    }, 500);

    setSideFront(true);
    setSideBack(false);
  };

  return (
    <React.Fragment>
      <div className="flashcards-container">
        <div className="content-wrapper">
          <NavLink className={"back-btn"} to={`/english`}>
            <GiReturnArrow />
          </NavLink>

          {/* <h2 className={"page-title"}>Мои Карточки</h2> */}
          <ul className="page-title">
            <li>К</li>
            <li>а</li>
            <li>р</li>
            <li>т</li>
            <li>о</li>
            <li>ч</li>
            <li>к</li>
            <li>и</li>
          </ul>
        </div>
        {loading ? (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        ) : (
          <div className={"flashcard-container"} onClick={flashcardHandler}>
            <div
              className={
                !sideBack
                  ? `flashcard flashcard-back`
                  : `flashcard flashcard-back`
              }
            >
              <p className="flashcard-text">
                {loadedCars && loadedCars[selectedCard].en}
              </p>
            </div>
            <div
              className={
                !sideFront
                  ? `flashcard flashcard-front flash-to-back`
                  : `flashcard flashcard-front flash-to-front`
              }
            >
              <p className="flashcard-text">
                {loadedCars && loadedCars[selectedCard].ru}
              </p>
            </div>
          </div>
        )}

        <div className="flashcards-btn-container">
          <button className="flascards-btn" onClick={previousHandler}>
            <GiPaperArrow className="flascards-btn-left" />
          </button>
          <GiPerspectiveDiceSixFacesRandom
            className="random-btn"
            onClick={randomCardHandler}
          />
          <button className="flascards-btn" onClick={nextHandler}>
            <GiPaperArrow className="flascards-btn-right" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FlashCards;
