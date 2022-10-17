import React, { useState, useContext } from "react";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";

import "./AddWord.css";

const AddWord = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const [error, SetError] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      ru: {
        value: "",
        isValid: true,
      },
      en: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  const signupFormHandler = async (e) => {
    e.preventDefault();

    setFormData(
      {
        ru: {
          value: formState.inputs.ru.value,
          isValid: true,
        },
        en: {
          value: formState.inputs.en.value,
          isValid: true,
        },
      },
      true
    );
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/cars",
        "POST",
        JSON.stringify({
          ru: formState.inputs.ru.value,
          en: formState.inputs.en.value,
          owner: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {
      SetError(true);
    }
  };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      {
        <form className="form__container-addcard" onSubmit={signupFormHandler}>
          <div className="form-content">
            <Input
              id="ru"
              element="input"
              type="text"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="Русский"
            />

            <Input
              id="en"
              element="input"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Английский"
            />
          </div>

          <div className={"button_container"}>
            <Button type="submit" disabled={!formState.isValid}>
              {!isLoading ? (
                "Добавить"
              ) : (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </Button>
          </div>
        </form>
      }
    </>
  );
};

export default AddWord;
