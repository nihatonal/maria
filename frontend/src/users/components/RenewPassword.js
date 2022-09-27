
import React, { useState } from 'react';

import Input from '../../shared/Components/FormElements/Input';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_EMAIL} 
    from '../../shared/util/validators.js';

import {useForm} from '../../shared/hooks/SignUpFrom-hook';
import Button from '../../shared/Components/FormElements/Button';
import Modal from '../../shared/Components/UIElements/Modal';
import envelope from '../../assets/images/envelope.svg';
import renew_email from '../../assets/images/password.svg';
import backArrow from '../../assets/icons/backarrow.svg';



import './SignInModal.css';


const RenewPassword = (props) => {

    const [formState, inputHandler] = useForm({
        email_renew: {
          value: '',
          isValid: false
        } 
      },false);

      const [successSend, setsuccessSend] = useState (false);

      const authSubmitHandler = () => {
        console.log(formState.inputs)
        setsuccessSend(true);
        setTimeout(() => setsuccessSend(false), 10000);
      };
      

      return (
        <React.Fragment>
            <Modal
                show={props.show}
                CloseonClick={props.close}
                modal_wrapper_className="modal_wrapper"
                modal__headerClass="header-wrapper"
                title={!successSend ? "Восстановление пароля" : "Проверьте почту"}
                subtitle="Мы отправим ссылку для восстановления пароля
                на вашу электронную почту"
                image= {!successSend ? renew_email : envelope }
                footerClass="hide"
            >
                {!successSend ? <img className="back_arrow" src={backArrow} alt="back arrow" onClick={props.goBackAuth}/> : null}
                
                {!successSend ? <Input
                    className="input-auth"
                    id='email_renew'
                    element="input"
                    type="email"
                    labelplaceholder ="Электронная почта"
                    placeholderclassName={formState.inputs.email_renew.isValid ? "placeholderclass isvalid" : "placeholderclass"}
                    placeholder=""
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                    onInput={inputHandler}
                    errorTextclassName="errortext"
                    labelclassName="labelclass"
                /> : null}

                {!successSend ? <Button 
                    className="header__btn-send-email"
                    type="submit"
                    onClick={authSubmitHandler}
                    inverse disabled={!formState.inputs.email_renew.isValid}>
                    Отправить
                </Button>: null}
                
            </Modal>
            

        </React.Fragment>
            
    )
};

export default RenewPassword;