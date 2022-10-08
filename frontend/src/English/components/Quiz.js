import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { AuthContext } from "../../shared/context/auth-context";

import { MdOutlineAutorenew } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";

import "./Quiz.css";
const Quiz = () => {
  const auth = useContext(AuthContext);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [question, setQuestions] = useState([]);

  const [questiondb, setQuestionDB] = useState([]);
  const [filtereddb, setFilteredDB] = useState([]);

  const [options, setOptions] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [arrLength, setArrLength] = useState(20);
  const [change, setChange] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${auth.userId}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setQuestionDB(res.data.cars);
        setFilteredDB(res.data.cars);
        setLoading(false);
      });
  }, [auth.token]);

  // Create selections answers.
  useEffect(() => {
    setOptions([
      ...new Set([].concat(questiondb.map((item) => item.en)).flat()),
    ]);
  }, [questiondb]);

  useEffect(() => {
    const arr = [];

    while (arr.length < 8) {
      let r = Math.floor(Math.random() * arrLength) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    setNumbers(arr);
  }, [change]);

  useEffect(() => {
    var arr2 = filtereddb.map((v) => ({
      questionText: `'${v.ru}'?`,
      answerOptions: [
        {
          answerText:
            v.en !== options[numbers[0]]
              ? options[numbers[0]]
              : options[numbers[1]],
          isCorrect: false,
        },
        {
          answerText:
            v.en !== options[numbers[2]]
              ? options[numbers[2]]
              : options[numbers[3]],
          isCorrect: false,
        },
        { answerText: v.en, isCorrect: true },
        {
          answerText:
            v.en !== options[numbers[4]]
              ? options[numbers[4]]
              : options[numbers[5]],
          isCorrect: false,
        },
      ],
      correctAnswer: v.en,
    }));
    setQuestions(arr2);
  }, [options, numbers, start]);

  const handleAnswerOptionClick = (isCorrect, text) => {
    setAnswer(isCorrect.correctAnswer);
    if (isCorrect.correctAnswer === text) {
      setScore(score + 1);
    }
  };

  const nextHandler = () => {
    setAnswer("");
    console.log(question);
    setChange(!change);
    setArrLength(options.length);

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < question.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const questionNumberHandler = (n) => {
    const filtered_db = questiondb
      .sort(() => Math.random() - Math.random())
      .slice(0, n);
    setFilteredDB(filtered_db);

    setStart(true);
    setLoading(true);
    setAnswer("");

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      questionNumberHandler(value);
    }
  };

  return (
    <div className="quiz-container">
      {!start ? (
        <div className="quiz-number-selection">
          <p>How many questions do you want?</p>
          <div>
            <button
              className={question.length < 5 ? "disabled" : ""}
              disabled={question.length < 5}
              onClick={() => questionNumberHandler(5)}
            >
              5
            </button>
            <button
              className={question.length < 10 ? "disabled" : ""}
              disabled={question.length < 10}
              onClick={() => questionNumberHandler(10)}
            >
              10
            </button>

            <button
              className={question.length < 20 ? "disabled" : ""}
              disabled={question.length < 20 && true}
              onClick={() => questionNumberHandler(20)}
            >
              20
            </button>
            <input
              type="text"
              value={value}
              onFocus={() => {
                setValue("");
              }}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="+20"
            />
          </div>
        </div>
      ) : loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <p>
            You scored {score} out of {question.length}
          </p>
          <MdOutlineAutorenew
            className="quiz-renew-icon"
            onClick={() => {
              setStart(false);
              setShowScore(false);
              setCurrentQuestion(0);
              setQuestions(questiondb);
              setFilteredDB(questiondb);
              setValue("");
            }}
          />
        </div>
      ) : (
        question.length > 0 && (
          <div className="quiz-wrapper">
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{filtereddb.length}
              </div>
              <div className="question-text">
                <p>
                  Which one is the meaning of the word{" "}
                  <span>{question[currentQuestion].questionText}</span>
                </p>
              </div>
            </div>
            <div className="answer-section">
              {question[currentQuestion].answerOptions
                .sort((a, b) => a.answerText.localeCompare(b.answerText))
                .map((answerOption) => (
                  <button
                    key={answerOption.answerText}
                    style={
                      answerOption.isCorrect === true ? { order: 0 } : null
                    }
                    className={
                      answer === answerOption.answerText
                        ? "correct"
                        : answer !== "" && answer !== answerOption.answerText
                        ? "incorrect"
                        : "btn-answer"
                    }
                    onClick={() =>
                      handleAnswerOptionClick(
                        question[currentQuestion],
                        answerOption.answerText
                      )
                    }
                  >
                    {answerOption.answerText}
                  </button>
                ))}
            </div>
            <div className="btn-quiz-footer">
              <MdOutlineHome
                className="btn-quiz-home"
                onClick={() => {
                  setStart(false);
                  setShowScore(false);
                  setCurrentQuestion(0);
                  setQuestions(questiondb);
                  setFilteredDB(questiondb);
                  setValue("");
                }}
              />
              <button className="btn-quiz-next" onClick={nextHandler}>
                Next
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;
