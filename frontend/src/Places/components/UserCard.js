import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import FriendModal from "./FriendsModal";
import "./UserCard.css";
const UserCard = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState([]);
  const userId = useParams().userId;
  const [friends, setFriends] = useState([]);

  const [showFriends, setShowFriends] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [requestTo, setRequestTo] = useState([]);
  const [requestFrom, setRequestFrom] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [check, setCheck] = useState(false);
  const [selectedUser, setSelectedUser] = useState(auth.userId);

  // get user which is visited
  useEffect(() => {
    let list;
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        list = responseData.user.friendRecievedRequest;
        setRequestFrom(responseData.user.friendRecievedRequest);
        if (list.includes(auth.userId)) {
          setCheck(true);
        } else {
          setCheck(false);
        }
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchCars();
  }, [setFriend, sendRequest, deleteFriendHandler, userId]);

  // get user which is logged in
  useEffect(() => {
    const fetchUser = async () => {
      let list;
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`
        );

        setFriends(responseData.user.friendList);
      } catch (err) {}
    };
    fetchUser();
  }, [setFriend, sendRequest, userId]);

  // get all users
  useEffect(() => {
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
        setUsersList(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, deleteFriendHandler, userId, auth.userId, setFriend]);

  // get user to which send request
  useEffect(() => {
    const fetchUser = async () => {
      let list;
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${selectedUser}`
        );
        list = responseData.user.friendSendRequest;
        setRequestTo(list);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, sendRequestHandler, deleteRequestHandler, selectedUser]);

  // Send Request handler
  const sendRequestHandler = async () => {
    let requestSend = [];

    if (!requestTo.includes(userId)) {
      requestSend = [...requestTo, userId];
      setCheck(true);
    } else if (requestTo.includes(userId)) {
      requestSend = requestTo.filter((item) => item !== userId);
      setCheck(false);
    }
    let sendToFriend = [];
    if (!requestFrom.includes(auth.userId)) {
      sendToFriend = [...requestFrom, auth.userId];
    } else if (requestFrom.includes(auth.userId)) {
      sendToFriend = requestFrom.filter((item) => item !== auth.userId);
    }

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/users/requestfriend/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          requestId: userId,
          requestFromFriend: sendToFriend,
          requestToFriend: requestSend,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //console.log(responseData);
    } catch (err) {}
  };

  // cancel request handler

  const deleteRequestHandler = async () => {
    let requestArr = [];
    requestArr = requestTo.filter((item) => item !== userId);

    let sendToFriend = [];
    sendToFriend = requestFrom.filter((item) => item !== auth.userId);

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/users/requestfriend/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          requestId: userId,
          requestFromFriend: sendToFriend,
          requestToFriend: requestArr,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //console.log(responseData);
      setCheck(false);
    } catch (err) {}
  };

  //send request
  const send_Request = (e) => {
    e.preventDefault();
    sendRequestHandler();
  };
  // cancel request
  const deleteRequest = (e) => {
    e.preventDefault();
    deleteRequestHandler();
  };
  // get list requests of auth
  const requestListHandler = () => {
    setShowRequest(true);
    const friendArr = loadedUsers.filter((user) =>
      requestFrom.includes(user.id)
    );
    //console.log(friendArr);
    setRequestList(friendArr);
  };

  // Deny request from users
  const deleteRequest_ = async (x) => {
    setSelectedUser(x);
    let requestArr = [];
    let sendToFriend = [];
    const userDecline = requestList.filter((user) => user.id === x);
    setRequestList(requestList.filter((user) => user.id !== x));
    try {
      requestArr =
        userDecline[0] &&
        userDecline[0].friendSendRequest.filter((item) => item !== auth.userId);

      sendToFriend = requestFrom.filter((item) => item !== x); //received list
    } catch (e) {}

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/users/requestfriend2/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          requestId: x,
          requestFromFriend: sendToFriend,
          requestToFriend: requestArr,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //.log(responseData.user.friendRecievedRequest);
      setRequestFrom(responseData.user.friendRecievedRequest);
      if (responseData.user.friendRecievedRequest.length < 1) {
        setShowRequest(false);
      }
    } catch (err) {}
  };

  // Add Friend to List of Friends

  const setFriend = async (user) => {
    let friendArr = [];
    let userFriend = [];

    if (!friends.includes(user)) {
      friendArr = [...friends, user];
    }
    try {
      const friendArrr = loadedUsers.filter((user) =>
        friendArr.includes(user.id)
      );
      if (!friendArrr.includes(auth.userId)) {
        userFriend = [...friendArrr[0].friendList, auth.userId];
      }
      setFilteredList(friendArrr);
      //console.log(userFriend);
    } catch (err) {}
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/friendlist/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          friendList: friendArr,
          userId: auth.userId,
          friendId: user,
          friendlist: userFriend,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setFriends(friendArr);
      deleteRequest_(user);
    } catch (err) {}
  };

  // Delete friend

  const deleteFriendHandler = async (x) => {
    let friendArr = [];
    let userFriend = [];
    friendArr = friends.filter((item) => item !== x);
    const filterList = userList.filter((user) => friendArr.includes(user.id));
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
      if (responseData.user.friendList.length < 1) {
        setShowFriends(false);
      }
    } catch (err) {}
  };

  return (
    <div className="usercard-wrapper">
      <div className="user-header">
        <div className="user-header-image">
          <img src={process.env.REACT_APP_ASSETS_URL + `${loadedUser.image}`} />
          <h4>{loadedUser.name}</h4>
        </div>

        <p className="user-header_friend-btn">
          {loadedUser.places && loadedUser.places.length}
          <br></br>
          <span>Посты</span>
        </p>
        <p onClick={() => setShowFriends(true)}>
          {friends && friends.length}
          <br></br>
          <span>Друзья</span>
        </p>
        <p>
          <NavLink to={`/${userId}/mywords`}>
            {loadedUser.cars && loadedUser.cars.length}
            <br></br>
            <span>Слова</span>
          </NavLink>
        </p>
      </div>
      {userId !== auth.userId ? (
        friends.includes(userId) ? (
          <p
            className="usercard_friends_status"
            onClick={() => deleteFriendHandler(userId)}
          >
            <FaCheckCircle style={{ color: "var(--color_green)" }} /> Bы друзья.{" "}
            <span className="usercard_friends_status-question">
              <IoIosRemoveCircle style={{ color: "var(--color_danger)" }} />
              Удалить?
            </span>
          </p>
        ) : !check ? (
          <p className="usercard_friends_status" onClick={send_Request}>
            <CiCircleRemove style={{ color: "var(--color_danger)" }} />
            Bы не друзья...{" "}
            <span className="usercard_friends_status-question">
              {" "}
              <IoIosAddCircle style={{ color: "var(--color_green)" }} />
              Отправить запрос?
            </span>
          </p>
        ) : (
          <p className="usercard_friends_status" onClick={deleteRequest}>
            <FaCheckCircle style={{ color: "var(--color_green)" }} />
            Вы отправили запрос..
            <span className="usercard_friends_status-question">
              <IoIosRemoveCircle style={{ color: "var(--color_danger)" }} />
              Удалить запрос?
            </span>
          </p>
        )
      ) : requestFrom.length > 0 ? (
        <p
          className="usercard_friends_status"
          onClick={() => {
            requestListHandler();
          }}
          style={{ paddingLeft: "20px" }}
        >
          <FaCheckCircle style={{ color: "var(--color_green)" }} />У вас есть
          запросы..
        </p>
      ) : null}

      {/* Friends modal */}

      <FriendModal
        showFriends={showFriends}
        setShowFriends={() => setShowFriends(false)}
        filteredList={filteredList}
        userId={userId}
        auth={auth.userId}
        deleteFriendHandler={(e) => deleteFriendHandler(e.target.id)}
      />
      {/* <ModalPlace show={showFriends} CloseonClick={() => setShowFriends(false)}>
        <div className="user_friendlist_container">
          {filteredList.map((user) => (
            <div className="user_friendlist_item" key={user.id}>
              <div className="user_friendlist_item-info">
                <img
                  src={process.env.REACT_APP_ASSETS_URL + `${user.image}`}
                  alt={user.name}
                />
                <p>{user.name}</p>
              </div>

              {userId === auth.userId && (
                <IoIosRemoveCircle
                  onClick={() => deleteFriendHandler(user.id)}
                  style={{ color: "var(--color_danger)" }}
                />
              )}
            </div>
          ))}
        </div>
      </ModalPlace> */}
      {/* Request modal */}
      <ModalPlace show={showRequest} CloseonClick={() => setShowRequest(false)}>
        <div className="requests_container">
          {requestList.length > 0 ? (
            <div className="user_friendlist_container">
              {requestList.map((user) => (
                <div className="user_friendlist_item" key={user.id}>
                  <div className="user_friendlist_item-info">
                    <img
                      src={process.env.REACT_APP_ASSETS_URL + `${user.image}`}
                      alt={user.name}
                    />
                    <p>{user.name}</p>
                  </div>
                  <div className="btn-request-wrapper">
                    <IoIosAddCircle
                      className="btn-request-status request-add"
                      onClick={() => setFriend(user.id)}
                    />

                    <IoIosRemoveCircle
                      className="btn-request-status request-remove"
                      onClick={() => deleteRequest_(user.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="request_not_have">У вас нет запросов.</p>
          )}
        </div>
      </ModalPlace>
    </div>
  );
};

export default UserCard;