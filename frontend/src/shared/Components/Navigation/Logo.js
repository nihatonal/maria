import React,{useContext} from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/auth-context";

import './Logo.css';

const Logo = (props) => {
    const auth = useContext(AuthContext);

    return (
        <div className = {`logo-wrapper ${props.className}`}>
            <Link className = {"logo-name"}  to={auth.isLoggedIn ? `/usermain` : "/"}><p >SkillDrive</p></Link>
            <div className = {"logo-line first-line"}></div>
            <div className = {"logo-line second-line"}></div>
        </div>
    )

};

export default Logo;