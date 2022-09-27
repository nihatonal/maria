import React from 'react';

import car from '../../assets/images/undraw_Vehicle_sale_a645 1.svg';

import './SectionCar.css';

const SectionCar =() => {
    return (
        <section className={"section-car content_container"}>
            <div className={"section-car__wrapper"}>
                <img src={car} alt={"uundraw_Vehicle_sale"}/>
                <div className={"section-car__wrapper-content"}>
                    <h2 className={"section-car__wrapper-title"}>Автомобили на любой вкус</h2>
                    <p className={"section-car__wrapper-desc"}>Вы всегда можете подобрать автомобиль любого класса 
                    от бюджетных моделей до премиум-класса и спорткаров.</p>
                </div>
            </div>
        </section>
    )
};

export default SectionCar;