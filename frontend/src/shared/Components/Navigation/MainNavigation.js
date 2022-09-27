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

  const userId = auth.userId;

  useEffect(() => {
    if (auth.isLoggedIn && auth.userId) {
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
          );
          setLoadedUser(responseData.user.image);
          setShowAuthModal(false);
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
    setDrawerIsOpen(true);
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

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <div className="side-drawer_head">
          <div className={"side-drawer__logo"}>
            <Link className={"side-drawer__logo-name"} to="/">
              <p>SkillDrive</p>
            </Link>
            <div className={"side-drawer-line first"}></div>
            <div className={"side-drawer-line second"}></div>
          </div>
          <div
            className="side-drawer_head-close"
            show={drawerIsOpen}
            onClick={closeDrawerHandler}
          >
            <img src={close} alt="X" />
          </div>
        </div>

        <nav
          className="main-navigation__drawer-nav"
          style={auth.isLoggedIn ? { order: "3" } : null}
        >
          <NavLinks />
        </nav>

        {!auth.isLoggedIn ? (
          <div className={"side-drawer__btn"}>
            <button
              className={"side-drawer__btn-signin"}
              onClick={showAuthHandler}
            >
              Войти
            </button>
          </div>
        ) : (
          <Avatar
            className={"mobile-avatar"}
            image={loadedUser && process.env.REACT_APP_ASSETS_URL + `${loadedUser}`}
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
        <div className="header__wrapper content-container">
          <div className={"header__logo"}>
            <Link
              className={"header__logo-name"}
              to={auth.isLoggedIn ? `/rentacar` : "/"}
            >
              <p>SkillDrive</p>
            </Link>
            <div className={"header__logo-line first"}></div>
            <div className={"header__logo-line second"}></div>
          </div>

          <nav
            className="header__nav"
            style={{ width: auth.isLoggedIn && "353px" }}
          >
            <NavLinks />
          </nav>

          {!auth.isLoggedIn ? (
            <ButtonSignIn
              btn="Войти"
              className="header__btn"
              btnclassName="header__btn-signin"
              btnonClick={showAuthHandler}
            />
          ) : (
            <Avatar
              image={loadedUser && process.env.REACT_APP_ASSETS_URL + `${loadedUser}`}
              alt={"avatar"}
              onClick={logOutHandler}
            />
          )}

          <div className="header__menu-icon" onClick={openDrawerHandler}>
            <div className={"header__menu-icon-item"} />
            <div className={"header__menu-icon-item"} />
            <div className={"header__menu-icon-item"} />
          </div>
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
