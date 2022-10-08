import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import FriendCard from "./FriendCard";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./FriendList.css";

const FriendList = (props) => {
  const auth = useContext(AuthContext);
  const {sendRequest } = useHttpClient();
  const [loadedCars, setLoadedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = auth.userId;

  useEffect(() => {
    setLoading(true);
    const fetchPlaces = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/friends/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res) {
            setLoadedCars(res.data.cars);
            setLoading(false);
          } else {
            setLoadedCars([]);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchPlaces();
  }, []);

  const confirmDeleteHandler = async (e) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/friends/${e.target.parentNode.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const posts = loadedCars.filter(
        (item) => item.id !== e.target.parentNode.id
      );
      setLoadedCars(posts);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <div className="friend-list-container">
        {loading && (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        )}
        {loadedCars.length >=1 ? (
          loadedCars.map((el, index) => (
            <FriendCard
              key={index}
              id={el.id}
              img={el.image}
              name={el.name}
              surname={el.surname}
              birthdate={el.birthdate}
              delete={confirmDeleteHandler}
            />
          ))
        ) : (
          <p>You have not any friends! Add one...</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default FriendList;
