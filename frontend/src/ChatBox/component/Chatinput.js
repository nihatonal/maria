import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const [msg, setmsg] = useState("");
  const handleEmojiPickerHideShow = () => {
    setEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setmsg(message);
  };
  const sendMsg = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setmsg("");
    }
  };
  return (
    <div>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendMsg(e)}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setmsg(e.target.value)}
        />
        <button className="submit" type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
