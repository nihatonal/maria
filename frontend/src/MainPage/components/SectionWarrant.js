import React from "react";

import transactions from '../../assets/images/undraw_online_transactions_02ka 1.svg';
import './SectionWarrant.css';

const SectionWarrant = () => {

return (
    <section className={"section-transactions content_container"}>
                    <div className={"section-transactions__wrapper"}>
                        <img src={transactions} alt={"undraw_online_transactions"}/>
                        <div className={"section-transactions__wrapper-content"}>
                            <h2 className={"section-transactions__wrapper-title"}>Гарантия честной аренды</h2>
                            <p className={"section-transactions__wrapper-desc"}>Общение и оплата происходит через наш 
                                сервис, что предотвращает вас от обмана.</p>
                        </div>
                    </div>
                </section>
    )
}

export default SectionWarrant;