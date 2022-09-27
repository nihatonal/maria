import React from "react";
import { Link } from 'react-router-dom';

import image from '../../../assets/images/502.svg'

import './FiveHundredTwo.css';

const FiveHundredTwo = () => {
    return (
        <div className="notfound-container">
            <div className = {"header__logo notfound"}>
                <Link className = {"header__logo-name"} to="/"><p >SkillDrive</p></Link>
                <div className = {"header__logo-line first"}></div>
                <div className = {"header__logo-line second"}></div>
            </div>
            <div className="notfound-content">
                <img className="nofound-image" src={image} alt="502"/>
                <h1 className="notfound-title">Упс...</h1>
                <p className="notfound-text">Кажется, что-то пошло не так. Мы уже работаем над устранением этой проблем.</p>
            </div>
        </div>
    )
}

export default FiveHundredTwo;