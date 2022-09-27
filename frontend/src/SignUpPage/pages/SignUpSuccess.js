import React from "react";

import Logo from "../../shared/Components/Navigation/Logo";
import Button from '../../shared/Components/FormElements/Button';
import Success from '../../assets/images/success.svg';

import './SignUpSuccess.css';

const SignUpSuccess = () => {


    return (
        <React.Fragment>
            <Logo />
            <div className="container-success">
                <img src={Success} alt="Success" />

                <h2 className="container-success-title">Успех!</h2>

                <p className="container-success-text">Вы успешно зарегистрировались. Дождитесь проверки 
                документов и начните пользоваться сервисом.</p>

                <Button
                    size = {" button--big"}
                to={'/'}
                >Перейти на главную</Button>

            </div>
        </React.Fragment>
        
    )
};

export default SignUpSuccess;