import React from 'react';

import AboutUs from '../components/AboutUs';
import Contact from '../components/Contact';
import Team from '../components/Team';
import './PageAbout.css';


const PageAbout = () => {
    return (
        <main className='section-about__container'>
            <AboutUs></AboutUs>
            <Contact></Contact>
            <Team></Team>
        </main>
    )
};

export default PageAbout;