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
// import UserDocs from "./SignUpPage/pages/UserDocs";
import SignUpSuccess from "./SignUpPage/pages/SignUpSuccess";
import Reset from "./users/components/Reset";

// import FiveHundredTwo from "./shared/Components/NotFound/FiveHundredTwo";
import FourHunderFour from "./shared/Components/NotFound/FourHunderFour";
import English from "./English/page/English";
//import RentACar from "./Cars/pages/RentACar";
//import RentUserCar from "./Cars/pages/RentUserCar";
// import UserCars from "./Cars/pages/UserCars";
// import AddCar from "./Cars/components/AddCar";
// import AddCarSuccess from "./Cars/components/AddCarSuccess";
// import UserCar from "./Cars/pages/UserCar";
// import UpdateCar from "./Cars/pages/UpdateCar";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import "./App.css";

const UserMain = React.lazy(() => import("./users/page/UserMain.js"));
const FlashCards = React.lazy(() => import("./English/components/FlashCards"));
const MyWords = React.lazy(() => import("./English/components/MyWords"));
const Hangman = React.lazy(() => import("./English/components/Hangman"));
const AddFriend = React.lazy(() => import("./Friends/components/AddFriend"));
const UserFriends = React.lazy(() => import("./Friends/page/Friends.js"));
const AddWord = React.lazy(() => import("./English/components/AddWord"));

const UserPlace = React.lazy(() => import("./Places/page/UserPlace.js"));
const PlaceItem = React.lazy(() => import("./Places/page/PlaceItem.js"));
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
        <Route exact path="/english" element={<English />} />

        <Route exact path="/:userId/cards" element={<FlashCards />} />
        <Route exact path="/:userId/friends" element={<UserFriends />} />
        <Route exact path="/:userId/mywords" element={<MyWords />} />
        <Route exact path="/:userId/hangman" element={<Hangman />} />
        <Route exact path="/:userId/addword" element={<AddWord />} />
        <Route exact path="/:userId/addfriend" element={<AddFriend />} />
        <Route exact path="/user/:userId/" element={<UserPlace />} />
        <Route exact path="/:userId/:pid" element={<PlaceItem />} />
        <Route exact path="*" element={<FourHunderFour />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/english" element={<English />} />
        <Route exact path="/about" element={<PageAbout />} />
        <Route exact path="/faq" element={<PageFaq />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/userphoto" element={<SignUpPhoto />} />
        <Route exact path="/reset/:token" element={<Reset />} />
        {/* <Route exact path="/userdocs" element={<UserDocs />} /> */}
        <Route exact path="/signup/success" element={<SignUpSuccess />} />
        <Route path="*" element={<FourHunderFour />} />
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
