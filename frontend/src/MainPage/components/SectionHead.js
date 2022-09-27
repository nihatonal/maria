import React from 'react';
import { NavLink } from 'react-router-dom';

import heroMain from '../../assets/images/undraw_city_driver_jh2h (1) 3.svg';
import heroAdaptive from '../../assets/images/undraw_city_driver_jh2h_small.svg';

import SignUpButton from '../../shared/Components/UIElements/SignUpButton';
import './SectionHead.css';

const SectionHead = () => {
    return (
        <div className={"container_hero content_wrapper"}>
                
                <div className={"container_hero__wrapper"}>
                    <h1 className={"container_hero__wrapper-title"}>Каршеринг в любой точке России</h1>
                    <p className={"container_hero__wrapper-text"}>Будьте всегда за рулём во время путешествий и командировок.</p>
                    
                    <NavLink className="SignUp"  to="/signup"> 
                        <SignUpButton/>
                    </NavLink>
                    
                </div>

                <img src={heroMain} alt={"undraw_city_driver"} />
                <img src={heroAdaptive} alt={"undraw_city_driversmall"} />
        
        </div>
    )
};

export default SectionHead;