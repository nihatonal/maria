import React from 'react';

import mainphoto from '../../assets/images/mainphoto.svg';
import './aboutus.css';

const AboutUs = () => {
    return (
        <section className="section-about content_wrapper">
            <div className="section-about__container">
                <img className="section-about__image"  src={mainphoto} alt="people are staying"/>
                <div className="section-about__content">
                    <h1 className="section-about__content-title">О нас</h1>
                    <p className="section-about__content-text">Это учебный проект, созданный с целью получения 
                        боевого опыта в разработке настоящего живого веб-приложения. Этот сервис 
                        имитирует работу каршеринга, в котором можно не только арендовать автомобили, 
                        но и сдавать их в аренду.</p>
                </div>
            </div>
        </section>
    )
}

export default AboutUs;