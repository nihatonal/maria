//import * as React from "react";
import React, { useState, useRef } from "react";

import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

import "./accordion.css";


function Accordion(props) {

    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("px");

    const content = useRef();

    function toggleAccordion(e) {
        setActiveState( setActive === "" ? "is-active" : "");
        setHeightState(
            setActive === "is-active" ? "0px" : `${content.current.scrollHeight}px`
        );
    }
   
    return (

        <div className="section-faq__wrapper">
            <button className="section-faq__wrapper-btn" onClick={toggleAccordion}>
                {props.title} <i className={'fa'}>{setActive ? <FaAngleUp /> : <FaAngleDown /> }</i>
            </button>
            
            <div 
                ref={content}
                style={{ maxHeight: `${setHeight}` }}
                className="section-faq__wrapper-content">
                    <p
                        className="section-faq__wrapper-text"
                        dangerouslySetInnerHTML={{ __html: props.content }}
                    />
            </div>
        </div>

 
    );

}

export default Accordion;