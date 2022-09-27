import React, { useContext } from "react";
import { Link } from "react-router-dom";

import image from "../../../assets/images/404.svg";
import Button from "../FormElements/Button";
import { AuthContext } from "../../context/auth-context";

import "./FiveHundredTwo.css";

const FiveHundredTwo = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="notfound-container">
      <div className={"header__logo notfound"}>
        <Link className={"header__logo-name"}  to={auth.isLoggedIn ? `/rentacar` : "./"}>
          <p>SkillDrive</p>
        </Link>
        <div className={"header__logo-line first"}></div>
        <div className={"header__logo-line second"}></div>
      </div>
      <div className="notfound-content">
        <img src={image} alt="502" />
        <h1 className="notfound-title">Такой страницы нет</h1>
        <p className="notfound-text text-404">
          Возможно, вы ошиблись в адресе страницы, либо она была удалена.
        </p>
        <Button
          to={auth.isLoggedIn ? `/rentacar` : "./"}
          size="big"
          btnclass="notfound-btn"
        >
          Перейти на главную
        </Button>
      </div>
    </div>
  );
};

export default FiveHundredTwo;
