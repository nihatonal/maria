import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { IoIosRemoveCircle } from "react-icons/io";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Friends.css";

const Friends = (props) => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const { sendRequest } = useHttpClient();
  const [filteredList, setFilteredList] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users`
        );
        const filterList = responseData.users.filter(
          (user) => user.id === userId
        )[0].friendList;
        const friendArr = responseData.users.filter((user) =>
          filterList.includes(user.id)
        );
        setLoadedUsers(responseData.users);
        setFilteredList(friendArr);
        setLoading(false);
      } catch (err) {}
    };
    fetchCars();
  }, [, deleteFriendHandler, auth.userId]);
  // Delete friend

  const deleteFriendHandler = async (x) => {
    let friendArr = [];
    let userFriend = [];
    friendArr = friends.filter((item) => item !== x);
    const filterList = loadedUsers.filter((user) =>
      friendArr.includes(user.id)
    );
    setFilteredList(filterList);

    try {
      const friendArrr = loadedUsers.filter((item) => item.id === x)[0]
        .friendList;
      if (friendArrr.includes(auth.userId)) {
        userFriend = friendArrr.filter((user) => user !== auth.userId);
      }

      console.log(userFriend, auth.userId);
    } catch (err) {}
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/friendlist/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          friendList: friendArr,
          userId: auth.userId,
          friendId: x,
          friendlist: userFriend,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //console.log(responseData.user)
      setFriends(friendArr);
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <div className="friends_container">
        {loading ? (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        ) : filteredList.length > 0 ? (
          filteredList.map((user) => (
            <div className="friend-card" key={user.id} id={user.id}>
              <div className="friend-card-info">
                <NavLink to={`/user/${user.id}`}>
                  <img
                    src={process.env.REACT_APP_ASSETS_URL + `${user.image}`}
                    alt={user.name}
                  />
                  <p>{user.username}</p>
                </NavLink>
              </div>

              {auth.userId === userId && (
                <div
                  id={user.id}
                  onClick={() => deleteFriendHandler(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <IoIosRemoveCircle
                    style={{
                      color: "var(--color_danger)",
                      pointerEvents: "none",
                      fontSize: "24px",
                    }}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div>
            <p>У вас нет друзей.</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Friends;
