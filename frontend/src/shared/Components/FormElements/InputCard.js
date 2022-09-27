import React from "react";

import './InputCard.css';

const InputCardContainer = props => {
    const content = (
        <div className={`form-card-container ${props.className}`}>
            <h2 className={`form-card-container-title ${props.titleclassName}`}  style={props.style}>
                {props.title}
            </h2>
            <div className={`form-card-container-items ${props.itemsclassName}`}  style={props.style}>
                {props.children}
            </div>
        </div>
    );
    return content
};

const InputCard = (props) => {
    return (
        <React.Fragment>
            
            <InputCardContainer {...props} />
            
        </React.Fragment>

    )
};

export default InputCard;
