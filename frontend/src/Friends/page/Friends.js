import React, { useContext } from "react";

import Button from "../../shared/Components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import FriendList from "../components/FriendList";
import "./Friends.css";

const Friends = (props) => {
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <div className="usercars-container">
        <h2 className={"page-title"}>Мои Друзья</h2>
        <FriendList />
        <div className="btn-add-car-wrapper">
          <Button
            to={`/${auth.userId}/addfriend`}
            inverse
            className="btn-add-car"
          >
            Добавить Друга
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Friends;
