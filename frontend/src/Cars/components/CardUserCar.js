import React from "react";

import engine from "../../assets/images/engine.png";
import shift from "../../assets/images/car_shift.png";
import star from "../../assets/images/star.png";

import "./CardUserCar.css";

const CardUserCar = (props) => {
  return (
    <div className="carCard-container" onClick={props.onClick} id={props.id}>
      <div className="car-image_wrapper">
        <img
          className="car-image"
          src={process.env.REACT_APP_ASSETS_URL +`${props.image}`}
          alt={props.brand}
          id={props.id}
        />
      </div>

      <div className="carCard_content">
        <div className="carCard-title">
          <div className="carCard-star">
            <img src={star} alt="star" />
            <p className="star">
              4,5 <span>(12)</span>
            </p>
          </div>
          <p className="carName">{`${props.brand} ${props.model}, ${props.year}`}</p>
        </div>
        <div className="carCard-engine-info">
          <div className="carCard-engine-info_item">
            <img src={engine} alt="engine" />
            <p>{`${props.engine_volume} / ${props.engine_power} / ${props.engine_type}`}</p>
          </div>
          <div className="carCard-engine-info_item">
            <img src={shift} alt="shift" />
            <p>{`${props.engine_transmission}`}</p>
          </div>
        </div>
        <p className="carCard-price">{`${props.price} ₽ в сутки`}</p>
      </div>
    </div>
  );
};

export default CardUserCar;
