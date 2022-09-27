import React, { useState, useEffect, useContext } from "react";

import Button from "../../shared/Components/FormElements/Button";
import CarList from "../components/CarList";
import { AuthContext } from "../../shared/context/auth-context";
import { ShareContext } from "../../shared/context/share-contex";
import Mycar from "../../assets/images/mycar.png";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./UserCars.css";

const UserCars = () => {
  const auth = useContext(AuthContext);
  const shared = useContext(ShareContext);
  const navigate = useNavigate();
  const [loadedCars, setLoadedCars] = useState();
  const [loading, setLoading] = useState(false);
  const [noCars, setNoCars] = useState(false);
  const userId = auth.userId;

  useEffect(() => {
    setLoading(true);
    const fetchPlaces = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL +`/cars/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoadedCars(res.data.cars);
          setLoading(false);
          setNoCars(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setNoCars(true);
        });
    };
    fetchPlaces();
  }, [userId]);

  const modalHandler = (e) => {
    e.stopPropagation();
    shared.selectedCar = loadedCars.filter((car) => car.id === e.target.id);

    localStorage.setItem("selectedCar", JSON.stringify(shared.selectedCar));

    navigate(`/${auth.userId}/${shared.selectedCar[0].id}`);
  };

  return (
    <React.Fragment>
      <div
        className="usercars-container"
        style={loadedCars && { marginTop: "150px" }}
      >
        {loading && !noCars && (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        )}

        {!loading && loadedCars && (
          <CarList cars={loadedCars} onClick={modalHandler} />
        )}

        {!loading && noCars && (
          <div className="usercars-content">
            <img src={Mycar} alt="usercars" />
            <h2 className="usercars-content-title">
              Зарабатывайте на своём автомобиле
            </h2>
            <h2 className="usercars-content-title-mobile">
              Зарабатывайте <br></br> на своём автомобиле
            </h2>
            <p className="usercars-content-subtitle">
              Сдавайте автомобиль в аренду и получайте заработок.
            </p>
          </div>
        )}

        <div className="btn-add-car-wrapper">
          <Button to={`/${auth.userId}/addcar`} inverse className="btn-add-car">
            Добавить автомобиль
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserCars;
