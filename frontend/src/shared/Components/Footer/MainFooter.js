import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import SocialLinks from "./SocialLinks";
import "./MainFooter.css";

const MainFooter = (props) => {
  const auth = useContext(AuthContext);
  
  const { pathname } = useLocation();
  const [carId, setCarId] = useState();

  useEffect(() => {
    const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    if (selectedCar && selectedCar.length < 0) {
      setCarId(selectedCar[0].id)
    }
  }, [carId]);

  if (
    
    pathname === `/${auth.userId}/cars` ||
    pathname === `/${auth.userId}/${carId}` ||
    pathname === `/${auth.userId}/success` ||
    pathname === `/${auth.userId}/addcar` ||
    pathname === `/rentacar/${carId}` ||
    pathname === `/cars/${carId}` ||
    pathname === "/signup" ||
    pathname === "/userphoto" ||
    pathname === "/userdocs" 
  )
    return null;

  const content = (
    <footer className={"footer content_wrapper"}>
      <div className="footer__content">
        <p className="footer__copyright">© SkillDrive Inc. 2020</p>
        <SocialLinks />
      </div>
    </footer>
  );

  return content;
};

export default MainFooter;
