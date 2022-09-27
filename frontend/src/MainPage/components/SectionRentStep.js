import React from "react";

import line from '../../assets/images/line.svg';
import lineSmall from '../../assets/images/line_small.svg';
import './SectionRentStep.css'

const SectionRentStep = () => {
    return (
                <section className={"section-rent content_container"}>
                    <div className={"section-rent__wrapper"}>
                        <h2 className={"section-rent__wrapper-title"}>Как арендовать автомобиль</h2>
                        <div className={"section-rent__wrapper-content"}>
                            <div className={"section-rent__wrapper-content-item"}>
                                <p className={"section-rent__wrapper-content-item-number"}>1</p>
                                <p className={"section-rent__wrapper-content-item-name"}>Выберите автомобиль</p>
                            </div>
                            <img src={line} alt={"line"}/>
                            <img src={lineSmall}alt={"line_small"}/>
                            <div className={"section-rent__wrapper-content-item"}>
                                <p className={"section-rent__wrapper-content-item-number"}>2</p>
                                <p className={"section-rent__wrapper-content-item-name"}>Забронируйте дату и время</p>
                            </div>
                            <img src={line} alt={"line"}/>
                            <img src={lineSmall} alt={"line_small"}/>
                            <div className={"section-rent__wrapper-content-item"}>
                                <p className={"section-rent__wrapper-content-item-number"}>3</p>
                                <p className={"section-rent__wrapper-content-item-name"}>Получите автомобиль</p>
                            </div>
                        </div>
                    </div>
                </section>
    )
}

export default SectionRentStep;