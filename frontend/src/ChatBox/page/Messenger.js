import React, { useEffect, useState, useContext, useRef } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useLocation } from "react-router-dom";
import Conversation from "../component/Conversation";
import Message from "../component/Message";
import ChatOnline from "../component/ChatOnline";
import { io } from "socket.io-client";
import { AuthContext } from "../../shared/context/auth-context";

import axios from "axios";
import "./Messenger.css";

export default function Messenger() {
  const { user, userId } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatData, setCurrentChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendPhoto, setFriendPhoto] = useState(null);
  const scrollRef = useRef();
  const location = useLocation();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (location.state) {
      setCurrentChat(location.state.id);

      const getUser = async () => {
        try {
          const res = await axios(
            process.env.REACT_APP_BACKEND_URL +
              "/users/" +
              location.state.friendId
          );

          setFriendPhoto(res.data.user.image);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }
  }, [location.state]);

  useEffect(() => {
    arrivalMessage &&
      currentChatData &&
      currentChatData.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userId);
    socket.current.on("getUsers", (users) => {
      console.log(users);
      // setOnlineUsers(
      //   user.followings.filter((f) => users.some((u) => u.userId === f))
      // );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/conversations/" + userId
        );
        setConversations(res.data);
      } catch (err) {
        // console.log(err);
      }
    };
    getConversations();
  }, [userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/message/" + currentChat
        );
        setMessages(res.data);
      } catch (err) {
        // console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const filterChat = conversations.filter(
      (conversation) => conversation._id === currentChat
    )[0];
    setCurrentChatData(filterChat);
    const friendId = filterChat && filterChat.members.find((m) => m !== userId);

    const getUser = async () => {
      try {
        const res = await axios(
          process.env.REACT_APP_BACKEND_URL + "/users/" + friendId
        );

        setFriendPhoto(res.data.user.image);
      } catch (err) {
        // console.log(err);
      }
    };
    getUser();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat,
    };

    const receiverId =
      currentChatData &&
      currentChatData.members.find((member) => member !== userId);

    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId,
      text: newMessage,
    });

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/message",
        "POST",
        JSON.stringify({
          message: message,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setMessages([...messages, responseData]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (messages && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              type="text"
              className="chatMenuInput"
            />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c._id)} key={c._id}>
                <Conversation
                  conversation={c}
                  currentUser={user}
                  online={false}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChatData ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      {m && (
                        <Message
                          message={m}
                          own={m.sender === user._id}
                          owner={user && user.image}
                          friend={friendPhoto && friendPhoto}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        {/* <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div> */}
      </div>
    </>
  );
}
