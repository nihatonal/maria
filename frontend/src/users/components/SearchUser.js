import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import "./SearchUser.css";

const SearchUser = (props) => {
  const { sendRequest } = useHttpClient();
  const [user, setUser] = useState("");
  const [show, setShow] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setLoadedUsers(responseData.users);
        setFilteredUsers(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [show]);

  return (
    <div>
      <input
        className="user_search_input"
        id={props.idUser}
        name={props.userNickname}
        type="text"
        onChange={(e) => {
          setUser(e.target.value);
        }}
        onFocus={() => {
          setShow(true);
        }}
        // onBlur={touchHandler}
        value={user}
      />
      <ModalPlace
        className="users_list"
        show={show}
        CloseonClick={() => setShow(false)}
      >
        <div className="users_container">
          {filteredUsers &&
            filteredUsers
              .filter((item) =>
                item.username.toLowerCase().includes(user.toLowerCase())
              )
              .map((user) => (
                <div
                  className="user-card"
                  onClick={() => {
                    setShow(false);
                    setUser("");
                  }}
                  key={user.id}
                >
                  <div className="user-card_bg"></div>
                  {" "}
                  <NavLink to={`/user/${user.id}`}>
                    <img
                      src={process.env.REACT_APP_ASSETS_URL + `${user.image}`}
                      alt={user.name}
                    />
                    <p>{user.username}</p>
                  </NavLink>
                </div>
              ))}
        </div>
      </ModalPlace>
    </div>
  );
};

export default SearchUser;
