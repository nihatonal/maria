import React from "react";
import { NavLink } from 'react-router-dom';

import './SectionLast.css';
import toy from '../../assets/images/undraw_toy_car_7umw 1.svg';

import SignUpButton from '../../shared/Components/UIElements/SignUpButton';

const SectionLast = () => {
    return (
        <section className={"section-registration content_container"}>
            <div className={"section-registration__wrapper"}>
                <img src={toy} alt={"undraw_online_transactions"}/>
                <h2 className={"section-registration__wrapper-title"}>Попробуйте аренду на себе</h2>
                
                <NavLink  to="/signup"> 
                    <SignUpButton/>
                </NavLink>   
            </div>
         </section>
    )
};

export default SectionLast;