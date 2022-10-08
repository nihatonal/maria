import React from "react";
import ReactDOM from "react-dom";

import "./SideDrawer.css";

const SideDrawer = (props) => {


  const content = (
    <aside className={!props.show ? `side-drawer`:`side-drawer show-side-drawer`} onClick={props.onClick}>
      {props.children}
    </aside>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
