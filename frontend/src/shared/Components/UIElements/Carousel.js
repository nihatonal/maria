import React, { useState } from "react";

import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import "./Carousel.css";

const Carousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(1);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
    if (count < length) {
      setCount(count + 1);
    } else if (count === length) {
      setCount(1);
    }
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
    if (count <= 1) {
      setCount(length);
    } else if (count <= length) {
      setCount(count - 1);
    }
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="carousel-wrapper">
      <div className="arrow left" onClick={prevSlide}>
        <FaArrowLeft className="FaAngle" />
      </div>
      <div className="arrow right" onClick={nextSlide}>
        <FaArrowRight className="FaAngle" />
      </div>
      <p className={"slide_index"}>{count} из {length} фото</p>
      {slides.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide activeSlide" : "slide"}
            key={length}
          >
            {/* <p className={"slide_index"}>{index}</p> */}
            {index === current && (
              <div className="slide-image-wrapper">
                <img
                  src={process.env.REACT_APP_ASSETS_URL + `${slide}`}
                  alt={slide}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default Carousel;
