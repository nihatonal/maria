import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { ShareContext } from "../../shared/context/share-contex";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import { SiGooglemessages } from "react-icons/si";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import SendRequest from "../../Places/components/SendRequest";
import ButtonUserCard from "../../shared/Components/UIElements/ButtonUserCard";

import axios from "axios";

import "./UserCard.css";
const UserCard = (props) => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const userId = useParams().userId;
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState([]);
  const [check, setCheck] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [motto, setMotto] = useState("");
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        setLoadedUser(responseData.user);
        setMotto(responseData.user.motto);
        setLoading(false);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, userId]);

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
        setFriendList(responseData.users);
        setLoading(false);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, userId, auth.userId, check]);

  const updateFriendList = () => {
    console.log(share.addFriend);
    setFilteredList(share.addFriend);
  };
  // Motto Section start
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
  // Motto Section end

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/conversations/" + userId
        );
        setConversation(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userId]);

  const conversationHandler = async () => {
    console.log("senderId: " + auth.userId);
    console.log("receiverId: " + userId);

    if (conversation.length > 0) {
      console.log("sohbet yes");
      navigate("/messenger");
    } else {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/conversations",
          "POST",
          JSON.stringify({
            senderId: auth.userId,
            receiverId: userId,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        navigate("/messenger");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="usercard-wrapper">
      {loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : (
        <div className="user-header">
          <div className="user-header-image">
            <img
              src={process.env.REACT_APP_ASSETS_URL + `${loadedUser.image}`}
            />
            <h4>{loadedUser.username}</h4>
          </div>
          <div className="user-header_info">
            <p className="user-header_friend-btn">
              {loadedUser.places && loadedUser.places.length}
              <br></br>
              <span>Посты</span>
            </p>
            <NavLink to={`/${userId}/friends`}>
              {filteredList && filteredList.length}
              <br></br>
              <span>Друзья</span>
            </NavLink>
            <p>
              <NavLink to={`/english/${userId}/mywords`}>
                {loadedUser.cars && loadedUser.cars.length}
                <br></br>
                <span>Слова</span>
              </NavLink>
            </p>
          </div>
          <forum onSubmit={mottoHandler} className="motto_wrapper">
            {auth.isLoggedIn && (
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
            )}
            <p>"{motto}"</p>
          </forum>
        </div>
      )}
      {auth.isLoggedIn && (
        <div className="usercard-btns-wrapper">
          {" "}
          <SendRequest triggerHandler={updateFriendList} />
          <ButtonUserCard onClick={conversationHandler}>
            <SiGooglemessages />
            Cообщение
          </ButtonUserCard>
        </div>
      )}
    </div>
  );
};

export default UserCard;
