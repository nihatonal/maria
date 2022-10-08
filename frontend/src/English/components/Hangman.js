import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import axios from "axios";

import img0 from "../../assets/images/hangman/0.jpg";
import img1 from "../../assets/images/hangman/1.jpg";
import img2 from "../../assets/images/hangman/2.jpg";
import img3 from "../../assets/images/hangman/3.jpg";
import img4 from "../../assets/images/hangman/4.jpg";
import img5 from "../../assets/images/hangman/5.jpg";
import img6 from "../../assets/images/hangman/6.jpg";
import { GiReturnArrow } from "react-icons/gi";
import "./Hangman.css";

const Hangman = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [nWrong, setnWrong] = useState(0);
  const [guessed, setGuessed] = useState(new Set());
  const [answer, setAnswer] = useState("");
  const [wordsDB, setWordsDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);

  const maxWrong = 6;
  const images = [img0, img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    setLoading(true);
    const fetchWords = async () => {
      return await axios
        .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setWordsDB(res.data.cars);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchWords();
  }, [userId]);

  useEffect(() => {
    const words = [
      ...new Set([].concat(wordsDB.map((item) => item.en)).flat()),
    ];
    setAnswer(
      wordsDB.length > 0 && words[Math.floor(Math.random() * words.length)]
    );
  }, [wordsDB, reset]);

  const resetGame = () => {
    setnWrong(0);
    setGuessed(new Set());
    setReset(!reset);
  };

  const guessedWord = () => {
    return (
      answer && answer.split("").map((ltr) => (guessed.has(ltr) ? ltr : "_"))
    );
  };

  const handleGuess = (evt) => {
    let ltr = evt.target.value;
    setGuessed((previousState) => new Set([...previousState, ltr]));
    setnWrong(answer.includes(ltr) ? nWrong + 0 : nWrong + 1);
  };

  const generateButtons = () => {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr, index) => (
      <button
        key={index}
        value={ltr}
        onClick={handleGuess}
        disabled={guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  };
  let alternateText = `${nWrong} wrong guesses`;
  return (
    <div className="Hangman">
      <div className="content-wrapper">
        <NavLink className={"back-btn"} to={`/english`}>
          <GiReturnArrow />
        </NavLink>
      </div>
      <img src={images[nWrong]} alt={alternateText} />
      <p className="Hangman_wrong">Number Wrong: {nWrong}</p>

      {loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : answer && answer === guessedWord().join("") ? (
        <p className="Hangman_win">You WIN!</p>
      ) : nWrong === maxWrong ? (
        <div className="Hangman_lose">
          <p>YOU LOSE </p>
          <p>
            Correct Word is: <span>{answer}</span>
          </p>
        </div>
      ) : (
        <div>
          <p className="Hangman-word">{guessedWord()}</p>
          <p className="Hangman-btns">{generateButtons()}</p>
        </div>
      )}

      <button id="reset" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default Hangman;
