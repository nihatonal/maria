import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import { AiOutlineClose } from "react-icons/ai";
import "./ModalCar.css";

const ModalOverlay = (props) => {
  const content = (
    <div
      className={`modalCar-container ${props.className}`}
      style={props.style}
    >
      <AiOutlineClose className="modal_close" onClick={props.CloseOnClick} />
      {props.children}
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
