import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import ButtonSignIn from "../../../shared/Components/UIElements/ButtonSignIn";
import close from "../../../assets/icons/close.svg";
import Avatar from "../UIElements/Avatar";
import Hamburger from "./Hamburger";
import SignInModal from "../../../users/components/SignInModal";
import RenewPassword from "../../../users/components/RenewPassword";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./MainNavigation.css";

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  //const userId = useParams().userId;

  const [setShowAuth, setShowAuthModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [setBackAuth, setBackAuthModal] = useState(false);
  const [userName, setUserName] = useState("");

  const userId = auth.userId;

  useEffect(() => {
    if (auth.isLoggedIn && auth.userId) {
      setShowAuthModal(false);
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
          );

          setLoadedUser(responseData.user.image);
          setUserName(responseData.user.name);
        } catch (err) {}
      };

      fetchPlaces();
    }
  }, [sendRequest, userId, auth.isLoggedIn]);

  const showAuthHandler = () => {
    setShowAuthModal(true);
  };

  const closeAuthHandler = () => {
    setShowAuthModal(false);
    setBackAuthModal(false);
  };

  const openDrawerHandler = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const setBackAuthModalHandler = () => {
    setBackAuthModal(false);
    setShowAuthModal(true);
  };
  const renewPasswordHandler = () => {
    setBackAuthModal(true);
    setShowAuthModal(false);
  };

  const logOutHandler = () => {
    navigate("/");
    auth.logout();
  };
  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav
          className="main-navigation__drawer-nav"
          style={auth.isLoggedIn ? { order: "3" } : null}
        >
          <NavLinks />
        </nav>

        {!auth.isLoggedIn ? (
          <div className={"side-drawer__btn"}>
            <button className="btn btn-sign_in" onClick={showAuthHandler}>
              Войти
            </button>
            <Link to="/signup" className="btn btn-sign_up">
              Регистрация
            </Link>
          </div>
        ) : (
          <Avatar
            className={"mobile-avatar"}
            image={
              loadedUser && process.env.REACT_APP_ASSETS_URL + `${loadedUser}`
            }
            alt={"avatar"}
            onClick={logOutHandler}
          />
        )}
      </SideDrawer>

      <SignInModal
        show={setShowAuth && !setBackAuth}
        forgetpassword={renewPasswordHandler}
        close={closeAuthHandler}
        footer={closeAuthHandler}
      />

      <RenewPassword
        show={setBackAuth}
        close={closeAuthHandler}
        goBackAuth={setBackAuthModalHandler}
      />

      <MainHeader>
        <div className="header__wrapper">
          <div className={"header__logo"}>
            <Link
              className={"header__logo-name"}
              to={auth.isLoggedIn ? `/usermain` : "/"}
            >
              {auth.isLoggedIn ? (
                <p onClick={()=> setDrawerIsOpen(false)}>
                  <span style={{ color: "var(--bg_secondary)" }}>Hi!</span>{" "}
                  {capitalizeFirstLetter(userName)}
                </p>
              ) : (
                <p>Ready to experience?</p>
              )}
            </Link>
          </div>

          <nav
            className="header__nav"
            style={{ width: auth.isLoggedIn && "353px" }}
          >
            <NavLinks />
          </nav>

          {!auth.isLoggedIn ? (
            <div className="header-button-wrapper">
              <button className="btn btn-sign_in" onClick={showAuthHandler}>
                Войти
              </button>
              <Link to="/signup" className="btn-sign_up">
                Регистрация
              </Link>
              {/* <ButtonSignIn
                btn="Войти"
                className="header__btn"
                btnclassName="header__btn-signin"
                btnonClick={showAuthHandler}
              />
              <ButtonSignIn
                btn="Регистрация"
                className="header__btn"
                btnclassName="header__btn-signin"
                btnonClick={showAuthHandler}
              /> */}
            </div>
          ) : (
            <Avatar
              image={
                loadedUser && process.env.REACT_APP_ASSETS_URL + `${loadedUser}`
              }
              alt={"avatar"}
              onClick={logOutHandler}
            />
          )}
          <Hamburger show={drawerIsOpen} onClick={openDrawerHandler} />
          {/* <div className="header__menu-icon" onClick={openDrawerHandler}>
            <div className={"header__menu-icon-item"} />
            <div className={"header__menu-icon-item"} />
            <div className={"header__menu-icon-item"} />
          </div> */}
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
