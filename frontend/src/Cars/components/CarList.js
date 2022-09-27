import React from "react";

import CardUserCar from "./CardUserCar";

import "./CarList.css";

const CarList = (props) => {

  return (
    <div className="userCars-container" >
      <h1 className="userCars-title">Мои автомобили</h1>
      {props.cars.map((car) => (
        
        <CardUserCar
          key={car.id}
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
          onClick={props.onClick}
        />
      ))}
    </div>
  );
};

export default CarList;
