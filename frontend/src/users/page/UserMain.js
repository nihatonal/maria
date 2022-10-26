import React, { useContext, useEffect, useState } from "react";

import "moment/locale/ru";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import PlaceList from "../../Places/components/PlaceList";
// import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./UserMain.css";
const UserMain = () => {
  const auth = useContext(AuthContext);

  // const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [idOfDeleteItem, setIdOfDeleteItem] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/places/", {
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
       // console.log(res.data);
        setPlaces(res.data.places);
        setLoading(false);
      });
  }, [auth.token]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [auth.token]);

  const confirmDeleteHandler = async () => {
    setLoading(true);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${idOfDeleteItem}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const posts = places.filter((item) => item.id !== idOfDeleteItem);
      setPlaces(posts);
      setConfirmDelete(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  

  return (
    <div className="usermain-container">
      {/* {loading && (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      )} */}
      <PlaceList
        loading={loading}
        update={show}
        places={places}
        confirmDelete={confirmDelete}
        onDelete={(e) => {
          setIdOfDeleteItem(e.target.parentNode.id);
          setConfirmDelete(true);
        }}
        close={() => setConfirmDelete(false)}
        setConfirmDelete={() => setConfirmDelete(false)}
        setIdOfDeleteItem={() => confirmDeleteHandler(idOfDeleteItem)}
      />
    </div>
  );
};

export default UserMain;
