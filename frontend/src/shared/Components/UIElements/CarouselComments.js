import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

// import "./Carousel_news.css";

const carouselProperties = {
  prevArrow: null,
  nextArrow: null,
  dots: false,
  dotsClass: "button__bar",
  infinite: true,
  speed: 500,
  initialSlide: 0,
  className: "slide",
  slidesToShow: 1,
  slidesToScroll: 1,
  verticalSwiping: true,
  vertical: true,
  centerMode: false,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 3,
        vertical: true,
        verticalSwiping: true,
        centerMode: false,
      },
    },
    {
      breakpoint: 799,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        centerMode: false,
      },
    },
  ],
};
const CarouselComments = (props) => {
  return (
    <div className="container_multi">
      <Slider {...carouselProperties}>{props.children}</Slider>
    </div>
  );
};

export default CarouselComments;
