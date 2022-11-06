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
import "./UserCard.css";
const UserCard = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState([]);
  const userId = useParams().userId;
  const [friends, setFriends] = useState([]);
  const [check, setCheck] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [motto, setMotto] = useState("Your Motto");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        setLoadedUser(responseData.user);
        console.log(responseData.user.motto);
        setMotto(responseData.user.motto);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, friendListHandler, deleteFriendHandler, userId]);

  useEffect(() => {
    const fetchUser = async () => {
      let list;
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`
        );
        console.log(responseData.user);
        setFriends(responseData.user.friendList);
        list = responseData.user.friendList;
        if (list.includes(userId)) {
          setCheck(true);
        } else {
          setCheck(false);
        }
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

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

        setFilteredList(friendArr);
        setFriendList(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [
    sendRequest,
    friendListHandler,
    deleteFriendHandler,
    userId,
    auth.userId,
  ]);

  const setFriend = async () => {
    let friendArr = [];

    if (!friends.includes(userId)) {
      friendArr = [...friends, userId];
      setCheck(true);
    } else if (friends.includes(userId)) {
      friendArr = friends.filter((item) => item !== userId);
      setCheck(false);
    }
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
    } catch (err) {}
  };

  const addFriendList = (e) => {
    e.preventDefault();
    setFriend();
  };

  const friendListHandler = () => {
    const filterList = friendList.filter((user) => user.id === userId)[0]
      .friendList;
    const friendArr = friendList.filter((user) => filterList.includes(user.id));
    console.log(friendArr);
    setFilteredList(friendArr);
    setShowFriends(true);
  };

  const deleteFriendHandler = async (x) => {
    let friendArr = [];
    friendArr = friends.filter((item) => item !== x);
    console.log(friends);
    const filterList = friendList.filter((user) => friendArr.includes(user.id));
    console.log(filterList);
    setFilteredList(filterList);
    setCheck(false);

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
    } catch (err) {}
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");

        mottoHandler();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [motto]);

  const mottoHandler = async (e) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/motto/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          motto: motto,
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

  return (
    <div className="usercard-wrapper">
      <div className="user-header">
        <div className="user-header-image">
          <img src={process.env.REACT_APP_ASSETS_URL + `${loadedUser.image}`} />
          <h4>{loadedUser.username}</h4>
        </div>
        <div className="user-header_info">
          <p className="user-header_friend-btn">
            {loadedUser.places && loadedUser.places.length}
            <br></br>
            <span>Посты</span>
          </p>
          <p onClick={friendListHandler}>
            {filteredList && filteredList.length}
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
        <forum onSubmit={mottoHandler} className="motto_wrapper">
          <input
            onChange={(e) => {
              setMotto(e.target.value);
            }}
            placeholder="write your motto"
            onFocus={() => setMotto("")}
            onBlur={() => {
              if (motto === "") {
                setMotto("Your Motto");
              } else {
                setMotto(motto);
              }
              mottoHandler();
            }}
            value={motto}
            className="motto_input"
          />
          <p>"{motto}"</p>
        </forum>
      </div>
      {userId !== auth.userId && (
        <div>
          {!check ? (
            <p className="usercard_friends_status" onClick={addFriendList}>
              <CiCircleRemove style={{ color: "var(--color_danger)" }} />
              Bы не друзья...{" "}
              <span className="usercard_friends_status-question">
                {" "}
                <IoIosAddCircle style={{ color: "var(--color_green)" }} />
                Добавить?
              </span>
            </p>
          ) : (
            <p className="usercard_friends_status" onClick={addFriendList}>
              <FaCheckCircle style={{ color: "var(--color_green)" }} /> Bы
              друзья.{" "}
              <span className="usercard_friends_status-question">
                <IoIosRemoveCircle style={{ color: "var(--color_danger)" }} />
                Удалить?
              </span>
            </p>
          )}
        </div>
      )}

      <ModalPlace show={showFriends} CloseonClick={() => setShowFriends(false)}>
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
      </ModalPlace>
    </div>
  );
};

export default UserCard;
