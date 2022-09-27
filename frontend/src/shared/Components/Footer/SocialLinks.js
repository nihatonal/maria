import React from 'react';

import vk from '../../../assets/icons/vk.svg';
import instagram from '../../../assets/icons/instagram.svg';
import facebook from '../../../assets/icons/facebook.svg';

import './SocialLinks.css';

const SocialLinks = props => {

  return    <div className="footer__social-icons">
                <div className= "icon">
                    <img src={vk} alt="VK"/>
                </div>
                <div className= "icon">
                    <img src={instagram} alt="instagram"/>
                </div>
                <div className= "icon">
                    <img src={facebook} alt="facebook"/>
                </div>
            </div>
};

export default SocialLinks;