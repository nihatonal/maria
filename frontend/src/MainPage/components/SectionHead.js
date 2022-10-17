import React from "react";
import { NavLink } from "react-router-dom";

import heroMain from "../../assets/images/blog.jpg";

import "./SectionHead.css";

const SectionHead = () => {
  return (
    <div className={"container_hero content_wrapper"}>
      <img src={heroMain} alt={"hero_main"} />
      <div className={"container_hero__wrapper"}>
        {/* <h1 className={"container_hero__wrapper-title"}>
          Каршеринг в любой точке России
        </h1>
        <p className={"container_hero__wrapper-text"}>
          Будьте всегда за рулём во время путешествий и командировок.
        </p> */}

        <NavLink className="btn-sign-up" to="/signup">
          Зарегистрироваться
        </NavLink>
      </div>
    </div>
  );
};

export default SectionHead;
