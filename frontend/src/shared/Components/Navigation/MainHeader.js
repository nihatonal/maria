import React, { useState, useEffect, useContext } from "react";
import { SignUpContext } from "../../context/signup-context";
import { AuthContext } from "../../context/auth-context";
import { useLocation } from "react-router-dom";
import "./MainHeader.css";

const MainHeader = (props) => {
  const auth = useContext(AuthContext);

  const Error = useContext(SignUpContext);

  const [scrolled, setScrolled] = useState(false);



  useEffect((_) => {
    const handleScroll = (_) => {
      if (window.pageYOffset > 90) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return (_) => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { pathname } = useLocation();

  if (Error.error) return null;

  if (
    pathname === "/signup/success" ||
    pathname === `/${auth.userId}/success` ||
    pathname === "/conditions" ||
    pathname === "/messages"
    
  )
    return null;

  return (
    <header
      className={
        scrolled === false
          ? "header"
          : "header sticky"
      }
    >
      {props.children}
    </header>
  );
};

export default MainHeader;
