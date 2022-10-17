import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import x from "../../../assets/icons/close.svg";
import "./ModalPlace.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal-container  ${props.className}`} style={props.style}>
      <div
        className={`modal-wrapper ${props.modal_wrapper_className}`}
        style={props.style}
      >
        <img
          src={x}
          className={`modal__close ${props.close}`}
          alt={"close"}
          onClick={props.CloseonClick}
        />
        <div className={`modal__forms ${props.modal__formClass}`}>
          {props.children}
        </div>
        <footer
          className={`modal__footer ${props.footerClass}`}
          onClick={props.footeronClick}
        >
          {props.signupbtn}
        </footer>
      </div>
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
