import React from 'react';

import  {personData} from '../../assets/team';
import './team.css';


function Team() {
    return (
        <section className="section-team content_wrapper">
            <div className="section-team__container">
                <h2 className="section-team__title">Команда</h2>
                <div className="section-team__content">

                        { personData.map((person) => (
                            <div className="section-team__content-item" key= {person.id}>
                                <img src={person.image} alt="Иван Иванов"/>
                                <p className="person_name">{person.name}</p>
                                <p className="person_profession">{person.person_profession}</p>
                            </div>
                        ))}

                </div>
            </div>
        </section>
    )
}

export default Team;







