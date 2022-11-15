import React, { Suspense } from "react";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { useLayoutEffect } from "react";

import MainPage from "./MainPage/pages/MainPage";
import PageAbout from "./PageAbout/pages/PageAbout";
import PageFaq from "./PageFaq/pages/PageFaq";
import MainNavigation from "./shared/Components/Navigation/MainNavigation";
import MainFooter from "./shared/Components/Footer/MainFooter";
import SignUpPage from "./SignUpPage/pages/SignUpPage";
import SignUpPhoto from "./SignUpPage/pages/SignUpPhoto";
import SignUpSuccess from "./SignUpPage/pages/SignUpSuccess";
import Reset from "./users/components/Reset";
import English from "./English/page/English";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import "./App.css";

const UserMain = React.lazy(() => import("./users/page/UserMain.js"));
const FlashCards = React.lazy(() => import("./English/components/FlashCards"));
const MyWords = React.lazy(() => import("./English/components/MyWords"));
const Hangman = React.lazy(() => import("./English/components/Hangman"));
const UserFriends = React.lazy(() => import("./Friends/page/Friends.js"));
const AddWord = React.lazy(() => import("./English/components/AddWord"));
const UserPlace = React.lazy(() => import("./Places/page/UserPlace.js"));
const PlaceItem = React.lazy(() => import("./Places/page/PlaceItem.js"));
const UserList = React.lazy(() => import("./users/page/UsersList.js"));

function App() {
  const { token, login, logout, userId } = useAuth();

  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);

    return children;
  };

  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Route exact path="/main" element={<UserMain />} />
        <Route exact path="/english/:userId" element={<English />} />
        <Route exact path="/:userId/cards" element={<FlashCards />} />
        <Route exact path="/:userId/friends" element={<UserFriends />} />
        <Route exact path="/english/:userId/mywords" element={<MyWords />} />
        <Route exact path="/:userId/hangman" element={<Hangman />} />
        <Route exact path="/:userId/addword" element={<AddWord />} />
        <Route exact path="/user/:userId/" element={<UserPlace />} />
        <Route exact path="/:userId/:pid" element={<PlaceItem />} />
        <Route exact path="/users" element={<UserList />} />

        <Route exact path="*" element={<MainPage />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        {/* <Route exact path="/" element={<MainPage />} /> */}
        <Route exact path="/" element={<UserMain />} />
        <Route exact path="/english" element={<English />} />
        <Route exact path="/about" element={<PageAbout />} />
        <Route exact path="/faq" element={<PageFaq />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/userphoto" element={<SignUpPhoto />} />
        <Route exact path="/reset/:token" element={<Reset />} />
        <Route exact path="/user/:userId/" element={<UserPlace />} />
        {/* <Route exact path="/userdocs" element={<UserDocs />} /> */}
        <Route exact path="/signup/success" element={<SignUpSuccess />} />
        <Route exact path="/users" element={<UserList />} />
        <Route path="*" element={<UserMain />} />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <Wrapper>
          <Suspense
            fallback={
              <div className="loading-wrapper">
                <i className="fa fa-circle-o-notch fa-spin"></i>
              </div>
            }
          >
            <Routes>{routes}</Routes>
          </Suspense>
        </Wrapper>
        {/* <MainFooter /> */}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
