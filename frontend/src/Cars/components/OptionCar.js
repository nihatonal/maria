import React, { useCallback, useContext, useEffect, useState } from "react";

import OutsideClickHandler from "../../shared/util/OutsideClickHandler";
import { ShareContext } from "../../shared/context/share-contex";
import cars from "../../assets/cars.json";
import menu_dropdown from "../../assets/icons/menu-down.svg";
import check from "../../assets/icons/check.svg";
import close from "../../assets/icons/close.svg";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import "./OptionCar.css";

const OptionCar = (props) => {
  const { width } = useWindowDimensions();
  const share = useContext(ShareContext);
  const [carName, setCar] = useState("Легковые");
  const [showList, setShowList] = useState(false);

  let selectedCars = [];

  const onChangeHandler = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      selectedCars.push(e.target.value);
    } else {
      const index = selectedCars.indexOf(e.target.value);
      selectedCars.splice(index, 1);
    }
    share.car = selectedCars;
  };

  const focusHandler = () => {
    setShowList(true);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowList(false);
        if (carName === "") {
          setCar("Легковые");
        }
      }}
    >
      <div
        className="input_car-wrapper"
        style={showList && width < 767 ? { position: "static" } : null}
      >
        <label className="input_car-placeholder">Категория</label>
        <img
          className="menu-dropdown search-car"
          src={menu_dropdown}
          alt="menu-dropdown"
        />
        <input
          className={`inputcar ${props.carClass}`}
          id={props.idCity}
          name={props.nameCity}
          type="select"
          onChange={(e) => setCar(e.target.value)}
          onFocus={focusHandler}
          value={carName}
        />
        {showList && (
          <div id="carlist" className="droplist-car-wrapper">
            <p className="calendar-title">Категория</p>
            <img
              className="calendar-close"
              src={close}
              onClick={() => setShowList(false)}
            />
            {cars.map((item) => (
              <div className="droplist-car-item" key={item.carname}>
                <input
                  className="checkbox"
                  id={item.carname}
                  type="checkbox"
                  name="cars"
                  value={item.carname}
                  onChange={onChangeHandler}
                  hidden
                />
                <label
                  htmlFor={item.carname}
                  className="droplist-car-item-content"
                >
                  <p className="droplist-car-item-name">{item.carname}</p>
                  <p className="droplist-car-item-name-holder">
                    {item.category}
                  </p>
                </label>
              </div>
            ))}
            <button
              className="select-btn btn-category"
              onClick={() => setShowList(false)}
              style={{ marginLeft: "20px" }}
            >
              Выбрать
            </button>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default OptionCar;
