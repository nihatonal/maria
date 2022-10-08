import React, { useContext, useEffect, useState } from "react";

import "moment/locale/ru";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

// import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./RentACar.css";
const RentACar = () => {
  const auth = useContext(AuthContext);
 
  // const navigate = useNavigate();

  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/cars/", {
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        
        setLoading(false);
      });
  }, [auth.token]);


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );

        setLoadedUser(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  // const getUser = (x) => {
  //   return loadedUser.filter((user) => user.id === x);
  // };


  return (
    <div className="usermain-container">
      {<h2 className="search-title">Welcome</h2>}
      {loading && (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      )}
    </div>
  );
};

export default RentACar;
