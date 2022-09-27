import React from "react";

import left from '../../assets/icons/left.svg';
import ivan from '../../assets/images/ivanivanov.png';
import right from '../../assets/icons/right.svg';

import './SectionComments.css';


const SectionComments = () => {
    return (
                <section className={"section-comment content_container"}>
                    <div className={"section-comment__wrapper"}>
                        <h2 className={"section-comment__wrapper-title"}>Отзывы клиентов</h2>
                        <div className={"section-comment__wrapper-content"}>
                            <img src={left} alt={"left"}/>
                            <div className={"section-comment__wrapper-content-item"}>
                                <img src={ivan} alt={"ivanivanov"}/>
                                <div className={"section-comment__wrapper-content-item-container"}>
                     
                                    <p className={"section-comment__wrapper-content-item-name"}>Иван Иванов</p>
                                    <p className={"section-comment__wrapper-content-item-city"}>Москва</p>
                                    <p className={"section-comment__wrapper-content-item-desc"}>Классный сервис! В путешествиях по стране часто берём машину
                                        в аренду. Здесь нету ограничений по зоне перемещения и поэтому
                                        есть возможность съездить в интересные туристические места,
                                        которые отдалены от города.</p>
                                </div>
                            </div>
                            <img src={right} alt={"right"}/>
                        </div>
                        <div className={"section-comment__wrapper-dots"}>
                            <span className={"section-comment__wrapper-dots-item active"}></span>
                            <span className={"section-comment__wrapper-dots-item"}></span>
                            <span className={"section-comment__wrapper-dots-item"}></span>
                            <span className={"section-comment__wrapper-dots-item"}></span>
                        </div>
                    </div>
                </section>
    )
};

export default SectionComments;