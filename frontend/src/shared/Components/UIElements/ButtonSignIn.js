import React from 'react';

import './ButtonSignIn.css';

const ButtonContainer = props => {
    const content = (
        <div className={`header__btn ${props.className}`} >
            <button className ={`header__btn-signin ${props.btnclassName}`} onClick={props.btnonClick}>{props.btn}</button>
        </div>
  );
  return content;
};

const Button = (props) => {
    return (
        <React.Fragment>

            <ButtonContainer {...props} />

        </React.Fragment>

    )
};

export default Button;