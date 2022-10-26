import React from "react";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import { IoIosRemoveCircle } from "react-icons/io";
import "./FriendsModal.css";

const FriendsModal = (props) => {
  return (
    <ModalPlace show={props.showFriends} CloseonClick={props.setShowFriends}>
      <div className="user_friendlist_container">
        {props.filteredList.map((user) => (
          <div className="user_friendlist_item" key={user.id} id={user.id}>
            <div className="user_friendlist_item-info">
              <img
                src={process.env.REACT_APP_ASSETS_URL + `${user.image}`}
                alt={user.name}
              />
              <p>{user.name}</p>
            </div>

            {props.userId === props.auth && (
              <div
                id={user.id}
                onClick={props.deleteFriendHandler}
                style={{ cursor: "pointer" }}
              >
                <IoIosRemoveCircle
                  style={{
                    color: "var(--color_danger)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </ModalPlace>
  );
};

export default FriendsModal;
