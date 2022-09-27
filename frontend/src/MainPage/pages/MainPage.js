import React from 'react';

import SectionHead from '../components/SectionHead';
import SectionRent from '../components/SectionRent';
import SectionCar from '../components/SectionCar';
import SectionWarrant from '../components/SectionWarrant';
import SectionRentStep from '../components/SectionRentStep';
import SectionSold from '../components/SectionSold';
import SectionComments from '../components/SectionComments';
import SectionLast from '../components/SectionLast';


import './MainPage.css';
const MainPage = () => {
    return (
        
        <main className='mainpage__container'>
            <SectionHead />
            <SectionRent />
            <SectionCar />
            <SectionWarrant/>
            <SectionRentStep />
            <SectionSold />
            <SectionComments />
            <SectionLast />
        </main>
           
    )
};

export default MainPage;