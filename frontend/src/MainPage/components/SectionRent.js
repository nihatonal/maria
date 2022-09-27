import React from 'react';

import arenda from '../../assets/images/undraw_fast_car_p4cu 1.svg';

import './SectionRent.css';

const SectionRent =() => {
    return (
        <section className={"section-arenda content_container"}>
            <div className={"section-arenda__wrapper"}>
                <img src={arenda} alt={"undraw_fast_car"}/>
                <div className={"section-arenda__wrapper-content"}>
                    <h2 className={"section-arenda__wrapper-title"}>Аренда напрямую от владельцев</h2>
                    <p className={"section-arenda__wrapper-desc"}>Вы получите автомобиль от его собственника,
                                    а мы проверим юридическую чистоту и техническую исправность.</p>
                </div>
            </div>
        </section>
    )
};

export default SectionRent;