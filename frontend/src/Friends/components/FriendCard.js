import React from "react";

import "./FriendCard.css";

const FriendCard = (props) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className="friend_card-wrapper" id={props.id}>
      <img
        src={process.env.REACT_APP_ASSETS_URL + `${props.img}`}
        alt={props.name}
      />
      <div className="friend_card-content">
        <p>
          {capitalizeFirstLetter(props.name)}{" "}
          {capitalizeFirstLetter(props.surname)}
        </p>
        <p>{props.birthdate}</p>
      </div>
      <button onClick={props.delete}>Delete</button>
    </div>
  );
};

export default FriendCard;
