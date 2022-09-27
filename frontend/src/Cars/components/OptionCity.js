import React, { useState, useContext, useEffect } from "react";

import { ShareContext } from "../../shared/context/share-contex";
import OutsideClickHandler from "../../shared/util/OutsideClickHandler";
import city from "../../assets/cities.json";
import "./OptionCity.css";

const OptionCity = (props) => {
  const share = useContext(ShareContext);
  const [cityName, setCity] = useState("Москва");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const selectedCity = JSON.parse(localStorage.getItem("searchCity"));
    if (selectedCity) {
      console.log(selectedCity.citySelect);
      setCity(selectedCity.citySelect);
    }
  }, []);
  const focusHandler = () => {
    setCity("");
    setShowList(true);
  };
  const touchHandler = () => {
    //setCity(share.city);
    setShowList(true);
  };

  const selectHandler = (e) => {
    setCity(e.target.firstChild.innerText);
    let citySelect = e.target.firstChild.innerText;
    setShowList(false);
    share.city = e.target.firstChild.innerText;
    localStorage.setItem(
      "searchCity",
      JSON.stringify({
        citySelect,
      })
    );
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowList(false);
        if (cityName === "") {
          setCity(share.city);
        }
      }}
    >
      <div className="input_city-wrapper">
        <label className="input_city-placeholder">{cityName}</label>
        <input
          className={`city_input ${props.cityClass}`}
          id={props.idCity}
          name={props.nameCity}
          type="text"
          onChange={(e) => setCity(e.target.value)}
          onFocus={focusHandler}
          onBlur={touchHandler}
          value={cityName}
        />

        {showList && (
          <div id="cityname" className="droplist-city-wrapper">
            {city
              .filter(
                (f) =>
                  f.city.toUpperCase().includes(cityName.toUpperCase()) ||
                  cityName === ""
              )
              .map((item) => (
                <div
                  className="droplist-city-item"
                  onClick={selectHandler}
                  key={item.city}
                >
                  <p className="droplist-city-item-name">{item.city}</p>
                  <p className="droplist-city-item-name-holder">{item.city}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default OptionCity;
