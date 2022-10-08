import React from "react";

import CardUserCar from "./CardUserCar";

import "./CarList.css";

const CarList = (props) => {
  return (
    <div className="userCars-container">
      <h1 className="userCars-title">Мои карточки</h1>
      {props.cars.map((car) => (
        <p key={car.id}>{car.ru}</p>
      ))}
    </div>
  );
};

export default CarList;
