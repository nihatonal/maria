import React, { useContext, useEffect, useState, useCallback } from "react";
import moment from "moment";
import "moment/locale/ru";
import Calender from "../../shared/Components/FormElements/Calender";
import OptionCity from "../components/OptionCity";
import OptionCar from "../components/OptionCar";
import CardUserCar from "../components/CardUserCar";
import { ShareContext } from "../../shared/context/share-contex";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/Components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import date_picker from "../../assets/icons/calender.svg";
import close from "../../assets/icons/close.svg";
import axios from "axios";

import "./RentACar.css";
const RentACar = () => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { isLoading, sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loadedCars, setLoadedCars] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const [date_ranges, setDateRanges] = useState();
  const [dbCars, setDbCars] = useState();
  const [result, setResult] = useState(false);
  const [initialPage, setInitialPage] = useState(true);

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
        setLoadedCars(res.data.cars);
        setDbCars(res.data.cars);
        setLoading(false);
      });
    if (share.city === null) {
      share.city = "Москва";
    }
  }, [auth.token]);

  // Save search credentials
  let searchDates;

  useEffect(() => {
    const searchItems = JSON.parse(localStorage.getItem("searchItems"));
    searchDates = JSON.parse(localStorage.getItem("dateRanges"));

    if (searchItems && dbCars) {
      let filtered = dbCars.filter(function(item) {
        setResult(true);
        setLoading(false);
        setInitialPage(false);
        return (
          !checker(item.dates, searchItems.date) &&
          item.city === searchItems.city
        );
      });

      if (searchDates) {
        setLoadedCars(filtered);
        setDateRanges(searchDates.startDate);
      }
    }
  }, [dbCars, searchDates]);

  // Get all user for user photo

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

  const getUser = (x) => {
    return loadedUser.filter((user) => user.id === x);
  };

  // Open Car Modal and showHandlers

  const modalHandler = (e) => {
    e.stopPropagation();
    const selectCar = loadedCars.filter((car) => car.id === e.target.id);
    localStorage.setItem("selectedCar", JSON.stringify(selectCar));

    navigate(`/rentacar/${selectCar[0].id}`);
  };

  const showHandlers = () => {
    setShow(true);
  };

  // Make an dates array from date_range
  function expandDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("DD-MM-YYYY"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }
  let checker = (src, target) => target.some((v) => src.includes(v));

  const searchHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(false);
    setInitialPage(false);
    let filtered = dbCars.filter(function(item) {
      return (
        !checker(item.dates, share.date_ranges) && item.city === share.city
      );
    });

    localStorage.setItem(
      "searchItems",
      JSON.stringify({ city: share.city, date: share.date_ranges })
    );
    console.log(filtered);
    setLoadedCars(filtered);

    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 850);
  };

  return (
    <div className="usermain-container">
      {loadedCars && initialPage && <h2 className="search-title">Арендуйте автомобиль</h2>}
      <form className="search-bar">
        <div className="input_container">
          <OptionCity cityClass="input_city" idCity="city" />

          <Calender
            className={"calender-fix"}
            image={date_picker}
            showHandler={showHandlers}
            date_range_start={
              share.date_ranges &&
              moment(share.date_ranges[0]).format("DD.MM.YY")
            }
            date_range_end={
              share.date_ranges &&
              moment(share.date_ranges[1]).format("DD.MM.YY")
            }
            close={() => setShow(false)}
            show={show}
            closeImg={close}
          />
          <OptionCar idCity="car" />
        </div>

        <Button onClick={searchHandler} className="search-btn" inverse>
          Найти
        </Button>
      </form>

      <div className="recommended-cars-container">
        {loadedCars && initialPage && <h3>Рекомендуем поблизости</h3>}
        {loading && (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        )}
        {loadedCars && initialPage && (
          <div className="recommended-cars-wrapper">
            {loadedCars.map((item) => (
              <div
                className="recommended-car-item"
                key={item.id}
                onClick={modalHandler}
              >
                <div className="recommended-car-item_filter" id={item.id}></div>
                <img
                  src={process.env.REACT_APP_ASSETS_URL + `${item.images[0]}`}
                  alt="car"
                />
                <div className="recommended-car-item-content">
                  <p>{`${item.brand} ${item.model}, ${item.year}`}</p>
                  <p>{`от ${item.price} ₽/сутки`}</p>
                </div>
                {loadedUser && (
                  <img
                    className="user_photo"
                    src={
                      process.env.REACT_APP_ASSETS_URL +
                      `${getUser(item.owner)[0].image}`
                    }
                    alt="userImage"
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {loadedCars && result && (
        <div className="searchCar-wrapper">
          {loadedCars.map((car) => (
            <div className="searchCar-item" key={car.id + 1}>
              <CardUserCar
                image={car.images[0]}
                brand={car.brand}
                model={car.model}
                year={car.year}
                engine_volume={car.engine_volume}
                engine_power={car.engine_power}
                engine_type={car.engine_type}
                engine_transmission={car.engine_transmission}
                price={car.price}
                id={car.id}
                onClick={width < 767 && modalHandler}
              />
              <button className="btn-rent" id={car.id} onClick={modalHandler}>
                Арендовать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentACar;
