import React from "react";


import './SendError.css'

const SendError = (props) => {

     return (
        <div className={`send-error ${props.className}`}>
            <p className={`send-error-text ${props.sendErrorTextClass}`}>{props.sendError}</p>
        </div>
    )
};

export default SendError;
//Не удалось продолжить регистрацию. Попробуйте ещё раз