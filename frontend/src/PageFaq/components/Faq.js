import React from 'react';

import Accordion from './Accordion';
import data from '../../assets/data.json';

import question from '../../assets/images/question.png';
import './faq.css';

function Faq () {

    return (
        <>
            <main className='faq-container' >   
                <section className="section-main content_wrapper">
                        <img src={question} alt="question"/>
                        <h1 className="section-main__title">Частые вопросы</h1>
                        <p className="section-main__desc">Отвечаем на вопросы, которые у вас могут возникнуть.</p>
                </section>
                
                <section className="section-faq content_wrapper">

                    { data.map((tab, index) => (
                        <Accordion
                            title = {tab.title}
                            content = {tab.description}
                            key = {index}
                        />
                    ))}

                </section>
            </main>
        </>
    );
};

export default Faq;