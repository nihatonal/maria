import React, { useState, useContext } from "react";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { ShareContext } from "../../shared/context/share-contex";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";

import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import FriendPhoto from "../../Friends/components/FriendPhoto";

import "./AppPlace.css";

const AddPlace = (props) => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const [error, SetError] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const signupFormHandler = async (e) => {
    e.preventDefault();
    setFormData(
      {
        title: {
          value: formState.inputs.title.value,
          isValid: true,
        },
        description: {
          value: formState.inputs.description.value,
          isValid: true,
        },
        address: {
          value: formState.inputs.address.value,
          isValid: true,
        },
      },
      true
    );
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          image: share.friendImage,
          owner: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //   navigate(`/${auth.userId}/userplaces`);
    } catch (err) {
      share.error = true;
      SetError(true);
    }
  };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      {
        <form
          className="form__container-addcar addplace"
          onSubmit={signupFormHandler}
        >
          <div className="form-content">
            <FriendPhoto />
            <Input
              id="title"
              element="input"
              type="text"
              label="Название"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Название"
              placeholderclassName="input-hidden"
              classNameWrapper="inputWrapper"
            />

            <Input
              id="description"
              element="input"
              type="text"
              label="Описание"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Описание"
              placeholderclassName="input-hidden"
              classNameWrapper="inputWrapper"
            />
            <Input
              id="address"
              element="input"
              type="text"
              label="Адрес"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Адрес"
              placeholderclassName="input-hidden"
              classNameWrapper="inputWrapper"
            />
          </div>

          <div className={"button_container"}>
            <Button
              type="submit"
              disabled={!formState.isValid}
              onClick={props.submit}
            >
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

export default AddPlace;
