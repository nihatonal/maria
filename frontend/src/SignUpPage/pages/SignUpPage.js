import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import InputCard from "../../shared/Components/FormElements/InputCard";
import SendError from "../components/SendError";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PHONE,
  VALIDATOR_PASSWORD,
  VALIDATOR_PASSWORD_CONFIRM,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import { SignUpContext } from "../../shared/context/signup-context";
import eye from "../../assets/icons/eye.svg";
import eye_active from "../../assets/icons/eye_active.svg";

import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const SignUp = useContext(SignUpContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      birthdate: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      password_confirm: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // password visibility
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);

  const togglePasswordVisiblity = (e) => {
    e.preventDefault();
    setPasswordShown(passwordShown ? false : true);
  };
  const togglePasswordConfirmVisiblity = (e) => {
    e.preventDefault();
    setPasswordConfirmShown(passwordConfirmShown ? false : true);
  };

  const signupFormHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          birthdate: formState.inputs.birthdate.value,
          email: formState.inputs.email.value,
          phone: formState.inputs.phone.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      SignUp.userId = responseData.userId;
      navigate("/userphoto");
    } catch (err) {
      SignUp.error = err.message;
      console.log(SignUp.error);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setPositionUp(true);
  };

  //After submit scroll butoon up

  const [positionUp, setPositionUp] = useState(false);
  const { height } = useWindowDimensions();
  const style_button = { top: height - 234, position: "absolute" };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      <form className="form__container" onSubmit={signupFormHandler}>
        <h2>Регистрация</h2>
        <InputCard>
          <Input
            id="name"
            element="input"
            type="text"
            label="ФИО"
            placeholder="ФИО полностью"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
            errorText="Поля обязательны для заполнения."
            onInput={inputHandler}
            placeholderclassName="input-hidden"
            errorTextclassName="signup-form-error-fix"
          />
          <Input
            id="birthdate"
            className="input-short"
            element="input"
            type="date"
            label="Дата рождения"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Поля обязательны для заполнения"
            onInput={inputHandler}
            placeholderclassName="input-hidden"
            errorTextclassName="signup-form-error-fix"
          />
          <Input
            id="email"
            element="input"
            type="email"
            placeholder="mail@example.com"
            label="Электронная почта"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Не верная почта"
            onInput={inputHandler}
            placeholderclassName="input-hidden"
            errorTextclassName="signup-form-error-fix"
          />
          <Input
            id="phone"
            className="input-short"
            element="input"
            type="tel"
            label="Телефон"
            placeholder="+7 900 000-00-00"
            validators={[VALIDATOR_PHONE()]}
            errorText="Не верный номер."
            onInput={inputHandler}
            placeholderclassName="input-hidden"
            errorTextclassName="signup-form-error-fix"
          />

          <div className="password_wrapper size-wide">
            <Input
              id="password"
              element="input"
              type={passwordShown ? "text" : "password"}
              label="Придумайте пароль "
              placeholder="•••••••••••••••••••"
              validators={[VALIDATOR_PASSWORD(), VALIDATOR_MINLENGTH(8)]}
              errorText="Пароль должно быть не менее восьми символов"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              errorTextclassName="signup-form-error-fix"
            />
            <img
              src={passwordShown ? eye_active : eye}
              alt="eye"
              className="eye"
              onClick={togglePasswordVisiblity}
            />
          </div>
          <div className="password_wrapper size-wide">
            <Input
              id="password_confirm"
              element="input"
              type={passwordConfirmShown ? "text" : "password"}
              label="Повторите пароль"
              placeholder="•••••••••••••••••••"
              validators={[
                VALIDATOR_PASSWORD_CONFIRM(formState.inputs.password.value),
              ]}
              errorText="Пароли не совпадают"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              errorTextclassName="signup-form-error-fix"
            />
            <img
              src={passwordConfirmShown ? eye_active : eye}
              alt="eye"
              className="eye_confirm"
              onClick={togglePasswordConfirmVisiblity}
            />
          </div>

          <div style={positionUp ? style_button : null}>
            <Button type="submit" inverse disabled={!formState.isValid}>
              {!isLoading ? (
                "Продолжить"
              ) : (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </Button>
          </div>
        </InputCard>
      </form>
    </>
  );
};

export default SignUpPage;
