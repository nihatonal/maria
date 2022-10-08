import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../shared/Components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";

import axios from "axios";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { GiReturnArrow } from "react-icons/gi";
import Pagination from "../../shared/Components/UIElements/Pagination";

import "./MyWords.css";
import "./FlashCards.css";

const MyWords = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedCars, setLoadedCars] = useState();
  const [loading, setLoading] = useState(false);

  const userId = auth.userId;

  useEffect(() => {
    setLoading(true);
    const fetchWords = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoadedCars(res.data.cars);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchWords();
  }, [userId]);

  const confirmDeleteHandler = async (e) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/cars/${e.target.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const posts = loadedCars.filter((item) => item.id !== e.target.id);
      setLoadedCars(posts);
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <div className="words-container">
        <div className="content-wrapper">
          <NavLink className={"back-btn"} to={`/english`}>
            <GiReturnArrow />
          </NavLink>

          <h2 className={"page-title"}>Мои слова</h2>
        </div>

        {loading && (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        )}
        <div className="word-list-container">
          {loadedCars && (
            <Pagination
              itemsPerPage={10}
              data={loadedCars}
              deleteHandler={confirmDeleteHandler}
            />
          )}
        </div>
        <div className="btn-add_word">
          <NavLink to={`/${auth.userId}/addword`}>
            Добавить Cловo
          </NavLink>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MyWords;
