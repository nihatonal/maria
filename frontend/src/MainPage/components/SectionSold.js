import React from "react";

import lineSmall from '../../assets/images/line_small.svg';
import tag from '../../assets/icons/tag 1.svg';
import lineShort from '../../assets/images/lineshort.svg';
import currency from '../../assets/icons/currency-usd 1.svg';
import percent from '../../assets/icons/percent 1.svg';
import cash from '../../assets/icons/cash-multiple 1.svg';

import './SectionSold.css';

const SectionSold = () => {
    return (
                <section className={"section-sold content_container"}>
                    <div className={"section-sold__wrapper"}>
                        <h2 className={"section-sold__wrapper-title"}>У вас есть автомобиль?</h2>
                        <p className={"section-sold__wrapper-subtitle"}>Чтобы он не простаивал — сдавайте его в аренду и зарабатывайте.</p>
                        <div className={"section-sold__wrapper-content"}>
                            <div className={"section-sold__wrapper-content-item"}>
                                <div className={"section-sold__wrapper-content-item-icon"}>
                                    <img src={tag} alt={"etiket"}/>
                                </div>
                                <p className={"section-sold__wrapper-content-item-name"}>Вы сами указываете цену</p>
                            </div>
                            <img src={lineShort} alt={"line"}/>
                            <img src={lineSmall} alt={"line_small"}/>
                            <div className={"section-sold__wrapper-content-item"}>
                                <div className={"section-sold__wrapper-content-item-icon"}>
                                    <img src={currency} alt={"currency-usd"}/>
                                </div>
                                <p className={"section-sold__wrapper-content-item-name"}>Мы страхуем автомобили</p>
                            </div>
                            <img src={lineShort} alt={"line"}/>
                            <img src={lineSmall} alt={"line_small"}/>
                            <div className={"section-sold__wrapper-content-item"}>
                                <div className={"section-sold__wrapper-content-item-icon"}>
                                    <img src={percent} alt={"percent"}/>
                                </div>
                                <p className={"section-sold__wrapper-content-item-name"}>Наша комиссия всего 3%</p>
                            </div>
                            <img src={lineShort} alt={"line"}/>
                            <img src={lineSmall} alt={"line_small"}/>
                            <div className={"section-sold__wrapper-content-item"}>
                                <div className={"section-sold__wrapper-content-item-icon"}>
                                    <img src={cash} alt={"cash-multiple"}/>
                                </div>
                                <p className={"section-sold__wrapper-content-item-name"}>Выплаты каждую неделю</p>
                            </div>
                        </div>
                    </div>
                </section>
    )
};

export default SectionSold;