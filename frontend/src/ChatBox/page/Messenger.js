import React, { useEffect, useState, useContext, useRef } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Conversation from "../component/Conversation";
import Message from "../component/Message";
import ChatOnline from "../component/ChatOnline";

import { AuthContext } from "../../shared/context/auth-context";

import axios from "axios";
import "./Messenger.css";

export default function Messenger() {
  const { user, userId } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendPhoto, setFriendPhoto] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/conversations/" + userId
        );
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
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
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const filterChat = conversations.filter(
      (conversation) => conversation._id === currentChat
    )[0];

    const friendId = filterChat && filterChat.members.find((m) => m !== userId);

    const getUser = async () => {
      try {
        const res = await axios(
          process.env.REACT_APP_BACKEND_URL + "/users/" + friendId
        );
        // setUser(res.data.user);
        console.log(res.data.user);
        setFriendPhoto(res.data.user.image);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentChat]);

  // console.log(messages);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat,
    };

    // const receiverId = currentChat.members.find(
    //   (member) => member !== userId
    // );

    // socket.current.emit("sendMessage", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage,
    // });
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
      setMessages([...messages, responseData.data]);
      setNewMessage("");
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
    // try {
    //   const res = await axios.post("/messages", message);
    //   setMessages([...messages, res.data]);
    //   setNewMessage("");
    // } catch (err) {
    //   console.log(err);
    // }
  };
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
              <div onClick={() => setCurrentChat(c._id)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.length > 0 &&
                    messages.map((m) => (
                      <div ref={scrollRef} key={m._id}>
                        <Message
                          message={m}
                          own={m.sender === userId}
                          owner={user && user.image}
                          friend={friendPhoto && friendPhoto}
                        />
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
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
