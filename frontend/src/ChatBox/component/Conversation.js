import React,{useState,useEffect} from "react";
import axios from "axios";
import test from '../../assets/images/denis.png'
import "./Conversation.css";

const Conversions = ({ conversation, currentUser }) => {
  
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const friendId = conversation.members.find((m) => m !== currentUser._id);

  //   const getUser = async () => {
  //     try {
  //       const res = await axios("/users?userId=" + friendId);
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [currentUser, conversation]);
  return (
    <div className="conversation">
      <img src={test} alt="test" className="conversationImg" />
      <span className="conversationName"></span>
    </div>
  );
};

export default Conversions;
