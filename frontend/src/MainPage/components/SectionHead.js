import React from "react";
import { NavLink } from "react-router-dom";

import heroMain from "../../assets/images/blog.jpg";

import "./SectionHead.css";

const SectionHead = () => {
  return (
    <div className={"container_hero content_wrapper"}>
      <img src={heroMain} alt={"hero_main"} />
      <div className={"container_hero__wrapper"}>

        <NavLink className="btn-sign-up" to="/signup">
          Зарегистрироваться
        </NavLink>
      </div>
    </div>
  );
};

export default SectionHead;
