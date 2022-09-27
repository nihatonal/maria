import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/ru";
import { FaArrowLeft } from "react-icons/fa";
import CarInfo from "../components/CarInfo";
import Carousel from "../../shared/Components/UIElements/Carousel";
import Button from "../../shared/Components/FormElements/Button";
import ModalCar from "../../shared/Components/UIElements/ModalCar";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "./UserCar.css";

const UserCar = () => {
  const [show, setShow] = useState(false);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [selectedCar, setSelectedCar] = useState();
  const [markDates, setMarkDates] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    setSelectedCar(selectedCar);
    if(selectedCar) setMarkDates(selectedCar[0].dates)
  }, []);

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/cars/${selectedCar[0].id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setSelectedCar(null);
      localStorage.removeItem("selectedCar");
      navigate(`/${auth.userId}/cars`);
    } catch (err) {}
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="usercar-container">
      <Link
        to={`/${auth.userId}/cars`}
        className="usercar-arrow-wrapper"
        onClick={() => localStorage.removeItem("selectedCar")}
      >
        <p className={"usercar-arrow"}>
          <i className={"fa"}>
            <FaArrowLeft />
          </i>
          Назад
        </p>
      </Link>

      {selectedCar && (
        <CarInfo
          brand={selectedCar[0].brand}
          model={selectedCar[0].model}
          year={selectedCar[0].year}
          price={selectedCar[0].price}
          price_for3={selectedCar[0].price_for3}
          price_more5={selectedCar[0].price_more5}
          images={selectedCar[0].images}
          mainImg={selectedCar[0].images[0]}
          secondImg={selectedCar[0].images[1]}
          thirdImg={selectedCar[0].images[2]}
          engine_volume={selectedCar[0].engine_volume}
          engine_power={selectedCar[0].engine_power}
          engine_type={selectedCar[0].engine_type}
          engine_transmission={selectedCar[0].engine_transmission}
          engine_run={selectedCar[0].engine_run}
          options={selectedCar[0].options}
          owner={selectedCar[0].owner}
          onClick={() => setShow(true)}
        />
      )}
      <div className="available-wrapper" id='user-car'>
        <h3 className="carinfo-content-title">Доступность</h3>

        <div className="calendar-wrapper">
          <div className="calendar-item" id="calendar-item-user">
            <p className="title-calender">
              {capitalizeFirstLetter(moment().format("MMMM")) +
                " " +
                moment().format("YYYY")}
            </p>
            <Calendar
              showNavigation={false}
              showNeighboringMonth={false}
              className="react-calendar"
              tileClassName={({ date, view }) => {
                if (
                  moment(date).format("YYYY/MM/DD") <
                  moment().format("YYYY/MM/DD")
                ) {
                  return "passed";
                }else if (markDates && markDates.find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                  return "highlight";
                }
              }}
            //  tileDisabled={({ date, view }) => {
            //   if (markDates && markDates.find((x) => x === moment(date).format("YYYY/MM/DD"))) {
            //     return "highlight";
            //   } else if (
            //     moment(date).format("YYYY/MM/DD") <
            //     moment().format("YYYY/MM/DD")
            //   ) {
            //     return "passed";
            //   }
            // }}
            />
          </div>
          <div className="calendar-item" id="calendar-item-user">
            <p className="title-calender">
              {capitalizeFirstLetter(
                moment()
                  .subtract(-1, "month")
                  .format("MMMM")
              ) +
                " " +
                moment().format("YYYY")}
            </p>
            <Calendar
              showNavigation={false}
              activeStartDate={
                new Date(moment().year(), moment().month() + 2, 0)
              }
              showNeighboringMonth={false}
              className="react-calendar"
              tileClassName={({ date, view }) => {
                if (
                  moment(date).format("YYYY/MM/DD") <
                  moment().format("YYYY/MM/DD")
                ) {
                  return "passed";
                }else if (markDates && markDates.find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                  return "highlight";
                } 
              }}  
            />
          </div>
        </div>
      </div>

      {selectedCar && (
        <ModalCar show={show} CloseOnClick={() => setShow(false)}>
          <Carousel slides={selectedCar[0].images} />
        </ModalCar>
      )}

      <div className={"button-container"}>
        <Button
          className="toupdatecar"
          to={selectedCar && `/cars/${selectedCar[0].id}`}
          style={{ width: "196px" }}
          inverse
        >
          {!isLoading ? (
            "Редактировать"
          ) : (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          )}
        </Button>

        <Button
          type="submit"
          className="btn-delete"
          inverse
          onClick={confirmDeleteHandler}
        >
          {!isLoading ? (
            "Удалить автомобиль"
          ) : (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserCar;
