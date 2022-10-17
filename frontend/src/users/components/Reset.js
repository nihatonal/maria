import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/Components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_PASSWORD,
  VALIDATOR_PASSWORD_CONFIRM,
} from "../../shared/util/validators.js";
import { useParams } from "react-router-dom";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import Button from "../../shared/Components/FormElements/Button";
import { MdOutlineHome } from "react-icons/md";
import eye from "../../assets/icons/eye.svg";
import eye_active from "../../assets/icons/eye_active.svg";

import "./Reset.css";

const Reset = (props) => {
  const token = useParams().token;
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //const [close, setClose] = useState(false);
  const [formState, inputHandler] = useForm(
    {
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

  // find user by token

  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      return axios
        .get(
          process.env.REACT_APP_BACKEND_URL + `/users/reset`,
          { params: { resetPasswordToken: token } },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setUserID(res.data.user[0]._id);
        })
        .catch((error) => {});
    };
    fetchWords();
  }, []);

  const resetHandler = async (e) => {
    e.preventDefault();
    setisLoading(true);
    await axios
      .put(process.env.REACT_APP_BACKEND_URL + `/users/updatepassword`, {
        password: formState.inputs.password.value,
        userId: userID,
      })
      .then(() => {
        setisLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  return (
    <div className="reset_container">
      {success ? (
        <div className="success-wrapper">
          <p>Password changed successfully!</p>
          <MdOutlineHome
            className="btn-home"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      ) : (
        <div className="reset_wrapper">
          <div className="password_wrapper">
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
          <div className="password_wrapper">
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
          <Button
            className="reset_button"
            type="submit"
            onClick={resetHandler}
            disabled={!formState.inputs.password.isValid}
          >
            {!isLoading ? (
              "Сбросить пароль"
            ) : (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reset;
