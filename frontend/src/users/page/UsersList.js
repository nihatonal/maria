import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { ShareContext } from "../../shared/context/share-contex";
import { AuthContext } from "../../shared/context/auth-context";

import "./UsersList.css";

const UsersList = () => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState();
  const [user, setUser] = useState("");

  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setFilteredUsers(responseData.users);
        setLoadedUsers(responseData.users);
        setLoading(false);
      } catch (err) {}
    };
    fetchCars();
  }, [auth.token]);
  return (
    <div className='userlist_container'>
      {loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : (
        <div className="userlist-wrapper">
          <input
            className="user_search_input"
            id={"idUser"}
            name={"userNickname"}
            type="text"
            placeholder="Поиск"
            onChange={(e) => {
              setUser(e.target.value);
            }}
            // onFocus={() => {

            // }}
            // onBlur={touchHandler}
            value={user}
          />
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
                      setUser("");
                    }}
                    key={user.id}
                  >
                    <div className="user-card_bg"></div>{" "}
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
        </div>
      )}
    </div>
  );
};

export default UsersList;
