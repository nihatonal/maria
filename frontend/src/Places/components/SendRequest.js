import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import "./UserCard.css";
import "./SendRequest.css";

const SendRequest = (props, user) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState([]);
  const userId = useParams().userId;
  const [friends, setFriends] = useState([]);

  const [requestTo, setRequestTo] = useState([]);
  const [requestFrom, setRequestFrom] = useState([]);
  const [request, setRequest] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [check, setCheck] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      let list;
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        console.log(responseData.user);
        list = responseData.user.friendRecievedRequest;
        setRequestFrom(responseData.user.friendRecievedRequest);
        if (list.includes(auth.userId)) {
          setCheck(true);
        } else {
          setCheck(false);
        }
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, sendRequestHandler, deleteRequestHandler, userId]);

  useEffect(() => {
    const fetchUser = async () => {
      let list;
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${selectedUser}`
        );
        list = responseData.user.friendSendRequest;
        setRequestTo(list);
        // console.log(list);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, sendRequestHandler, deleteRequestHandler, selectedUser]);

  // Send Request
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
      console.log(responseData);
    } catch (err) {}
  };

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
      console.log(responseData);
      setCheck(false);
    } catch (err) {}
  };

  const send_Request = (e) => {
    e.preventDefault();
    sendRequestHandler();
  };
  const deleteRequest = (e) => {
    e.preventDefault();
    deleteRequestHandler();
  };

  const requestListHandler = () => {
    setShowRequest(true);
    const friendArr = props.users.filter((user) =>
      requestFrom.includes(user.id)
    );
    console.log(friendArr);
    setRequestList(friendArr);
  };

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
      console.log(responseData.user.friendRecievedRequest);
      setRequestFrom(responseData.user.friendRecievedRequest);
    } catch (err) {}
  };

  // Add Friend to List of Friends

  const setFriend = async (user) => {
    let friendArr = [];

    if (!friends.includes(user)) {
      friendArr = [...friends, user];
    }
    console.log(friendArr);
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/friendlist/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          friendList: friendArr,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setFriends(friendArr);
      setShowRequest(false);
      deleteRequest_(user);
    } catch (err) {}
  };

  return (
    <div className="usercard-wrapper">
      {userId !== auth.userId ? (
        friends.includes(userId) ? (
          <p
            className="usercard_friends_status"
            // onClick={() => deleteFriendHandler(userId)}
          >
            <FaCheckCircle style={{ color: "var(--color_green)" }} /> B?? ????????????.{" "}
            <span className="usercard_friends_status-question">
              <IoIosRemoveCircle style={{ color: "var(--color_danger)" }} />
              ???????????????
            </span>
          </p>
        ) : !check ? (
          <p className="usercard_friends_status" onClick={send_Request}>
            <CiCircleRemove style={{ color: "var(--color_danger)" }} />
            B?? ???? ????????????...{" "}
            <span className="usercard_friends_status-question">
              {" "}
              <IoIosAddCircle style={{ color: "var(--color_green)" }} />
              ?????????????????? ?????????????
            </span>
          </p>
        ) : (
          <p className="usercard_friends_status" onClick={deleteRequest}>
            <FaCheckCircle style={{ color: "var(--color_green)" }} />
            ???? ?????????????????? ????????????..
            <span className="usercard_friends_status-question">
              <IoIosRemoveCircle style={{ color: "var(--color_danger)" }} />
              ?????????????? ?????????????
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
          <FaCheckCircle style={{ color: "var(--color_green)" }} />?? ?????? ????????
          ??????????????..
        </p>
      ) : null}

      <ModalPlace show={showRequest} CloseonClick={() => setShowRequest(false)}>
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
                <div onClick={props.triggerHandler}>
                  <IoIosAddCircle
                    className="btn-request-status request-add"
                    onClick={() => setFriend(user.id)}
                  />
                </div>
                <div>
                  <IoIosRemoveCircle
                    className="btn-request-status request-remove"
                    onClick={() => deleteRequest_(user.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalPlace>
    </div>
  );
};

export default SendRequest;
