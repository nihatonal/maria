import React, { useEffect, useContext, useState } from "react";

import { Link } from "react-router-dom";
import Avatar from "../../shared/Components/UIElements/Avatar";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Options } from "../../assets/Options.js";
import image_icon from "../../assets/images/image-multiple.svg";

import "./CarInfo.css";

const CarInfo = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();

  const userId = auth.userId;

  useEffect(() => {
    
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +`/users/${props.owner}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const splitHandler = (str) => {
    const newStr = str.split(" /");
    return newStr;
  };


  return (
    <div className="carinfo-container">
      <div className="carinfo-images_wrapper">
        <div
          className="carinfo-image_wrapper main-photo"
          onClick={props.onClick}
        >
          <img
            className={`main-img`}
            src={process.env.REACT_APP_ASSETS_URL +`${props.mainImg}`}
            alt={props.model}
          />
          <div className="image-icon_wrapper" onClick={props.onClick}>
            <img src={image_icon} alt="image_icon" />
          </div>
        </div>
        <div
          className="carinfo-image_wrapper side-image-1"
          onClick={props.onClick}
        >
          <img
            className={`second-img`}
            src={process.env.REACT_APP_ASSETS_URL +`${props.secondImg}`}
            alt={props.model}
          />
        </div>
        <div
          className="carinfo-image_wrapper side-image-2"
          onClick={props.onClick}
        >
          <img
            className={`second-img`}
            src={process.env.REACT_APP_ASSETS_URL +`${props.thirdImg}`}
            alt={props.model}
          />
          {props.images.length > 1 && <p
            className="carinfo-image-count"
            onClick={props.onClick}
          >{`+ ещё  фото ${props.images.length - 3}`}</p>}
        </div>
      </div>
      <div className="carinfo-maincontent-wrapper">
        <div className="carinfo-maincontent">
          <h2>{`${props.brand} ${props.model}, ${props.year}`}</h2>
          <div className="carinfo-maincontent-prices">
            <div className="carinfo-maincontent-price-item">
              <p>{`${props.price} ₽/сут.`}</p>
              <span>обычная аренда</span>
            </div>
            <div className="carinfo-maincontent-price-item">
              <p>{`${props.price_for3} ₽/сут.`}</p>
              <span>при аренде на 3 дня</span>
            </div>
            <div className="carinfo-maincontent-price-item">
              <p>{`${props.price_more5} ₽/сут.`}</p>
              <span>при аренде более 5 дней</span>
            </div>
          </div>
        </div>
        <div className={loadedUser && userId === props.owner ? "owner-wrapper" : "owner-wrapper renter"}>
          {loadedUser && (
            <Avatar
              className={"owner-wrapper-image"}
              image={process.env.REACT_APP_ASSETS_URL +`${loadedUser.image}`}
              alt={"avatar"}
            />
          )}

          {userId === props.owner ? <div className={"owner-info"}>
            {loadedUser && <p>{loadedUser.name}</p>}
            {loadedUser && <p className={"owner-info-status"}>Это вы</p>}
          </div>
            :
          <div className={"owner-info owner-link"}>
            {loadedUser && <p>{loadedUser.name}</p>}
            {loadedUser && <p className={"owner-info-status"}>Владелец</p>}

            <Link className="link-to-profil" to="/">
              Посмотреть профиль
            </Link>
          </div>}
        </div>

        <div className="carinfo-characters">
          <h3 className="carinfo-content-title">Характеристики</h3>
          <div className="carinfo-character-items-wrapper">
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Год выпуска</p>
              <p className="carinfo-character-item-desc">{`${props.year} год`}</p>
            </div>
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Кузов</p>
              <p className="carinfo-character-item-desc">Седана</p>
            </div>
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Двигатель</p>
              <p className="carinfo-character-item-desc">{`${props.engine_volume} л / ${props.engine_power} л.с. / ${props.engine_type}`}</p>
            </div>
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Трансмиссия</p>
              <p className="carinfo-character-item-desc">
                {splitHandler(props.engine_transmission)[0]}
              </p>
            </div>
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Привод</p>
              <p className="carinfo-character-item-desc">
                {splitHandler(props.engine_transmission)[1]}
              </p>
            </div>
            <div className="carinfo-character-item">
              <p className="carinfo-character-item-name">Пробег</p>
              <p className="carinfo-character-item-desc">{`${props.engine_run} км`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="carinfo-line"></div>
      <div>
        <h3 className="carinfo-content-title">Опции</h3>
        <div className="carinfo-options_items">
          {props.options.map((item) => (
            <div
              className="carinfo-options_item"
              key={Options.filter((x) => x.name === item)[0].id}
            >
              <img
                src={Options.filter((x) => x.name === item)[0].image}
                alt={Options.filter((x) => x.name === item)[0].name}
              />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="carinfo-line"></div>
    </div>
  );
};

export default CarInfo;
