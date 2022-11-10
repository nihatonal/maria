import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import NavBar from "./NavBar";
import Backdrop from "../UIElements/Backdrop";
import ButtonSignIn from "../../../shared/Components/UIElements/ButtonSignIn";
import close from "../../../assets/icons/close.svg";
import Avatar from "../UIElements/Avatar";
import FriendsModal from "../../../Places/components/FriendsModal";
import Hamburger from "./Hamburger";
import SignInModal from "../../../users/components/SignInModal";
import RenewPassword from "../../../users/components/RenewPassword";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";


import "./MainNavigation.css";

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  //const userId = useParams().userId;

  const [setShowAuth, setShowAuthModal] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [setBackAuth, setBackAuthModal] = useState(false);
  const [userName, setUserName] = useState("");

  // Friend modal settings
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState([]);

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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users`
        );
        const filterList = responseData.users.filter(
          (user) => user.id === userId
        )[0].friendList;
        const friendArr = responseData.users.filter((user) =>
          filterList.includes(user.id)
        );
        setLoadedUsers(responseData.users);
        setFilteredList(friendArr);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, deleteFriendHandler, auth.userId]);

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

  // Delete friend

  const deleteFriendHandler = async (x) => {
    let friendArr = [];
    let userFriend = [];
    friendArr = friends.filter((item) => item !== x);
    const filterList = loadedUsers.filter((user) =>
      friendArr.includes(user.id)
    );
    setFilteredList(filterList);

    try {
      const friendArrr = loadedUsers.filter((item) => item.id === x)[0]
        .friendList;
      if (friendArrr.includes(auth.userId)) {
        userFriend = friendArrr.filter((user) => user !== auth.userId);
      }

      console.log(userFriend, auth.userId);
    } catch (err) {}
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/friendlist/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          friendList: friendArr,
          userId: auth.userId,
          friendId: x,
          friendlist: userFriend,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //console.log(responseData.user)
      setFriends(friendArr);
      if (responseData.user.friendList.length < 1) {
        setShowFriends(false);
      }
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      <SideDrawer
        show={drawerIsOpen}
        onClick={closeDrawerHandler}
        style={auth.isLoggedIn ? { order: "3" } : null}
        auth={!auth.isLoggedIn}
        showAuthHandler={showAuthHandler}
        image={loadedUser && process.env.REACT_APP_ASSETS_URL + `${loadedUser}`}
        logOutHandler={logOutHandler}
        friendsBtn={() => setShowFriends(true)}
      />

      <SignInModal
        show={setShowAuth && !setBackAuth}
        forgetpassword={renewPasswordHandler}
        close={closeAuthHandler}
        footer={closeAuthHandler}
      />
      <FriendsModal
        showFriends={showFriends}
        setShowFriends={() => setShowFriends(false)}
        filteredList={filteredList}
        userId={userId}
        auth={auth.userId}
        deleteFriendHandler={(e) => deleteFriendHandler(e.target.id)}
      />
      <RenewPassword
        show={setBackAuth}
        close={closeAuthHandler}
        goBackAuth={setBackAuthModalHandler}
      />

      <MainHeader>
        <div className="header__wrapper">
   
          <NavBar
            userId={auth.userId}
            drawerIsOpen={drawerIsOpen}
            openDrawerHandler={openDrawerHandler}
            auth={auth.isLoggedIn}
          />
          {!auth.isLoggedIn ? (
            <div className="header-button-wrapper">
              <button className="btn btn-sign_in" onClick={showAuthHandler}>
                Войти
              </button>
              <Link to="/signup" className="btn btn-sign_up">
                Регистрация
              </Link>
            </div>
          ) : null}

          {/* <Hamburger
            show={drawerIsOpen}
            onClick={openDrawerHandler}
            auth={auth.isLoggedIn}
          /> */}
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
