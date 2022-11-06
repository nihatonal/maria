import React from "react";

const Card = props => {
  const { word, imgDesc, className, onClick } = props;
  return (
    <div className={`grid-card ${className}`} onClick={onClick}>
      {/* <img
        className={`img-thumbnail img-fluid grid-img`}
        src={imgSource}
        alt={imgDesc}
      /> */}
      <p>{word}</p>
    </div>
  );
};

export default Card;
