import React, {  useState, useContext } from "react";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { ShareContext } from "../../shared/context/share-contex";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";

import FriendPhoto from "./FriendPhoto";
import "./AddFriend.css";

const AddFriend = () => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const [error, SetError] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: true,
      },
      surname: {
        value: "",
        isValid: true,
      },
      birthdate: {
        value: "",
        isValid: true,
      },
      image: {
        value: null,
        isValid: true,
      },
    },
    false
  );

  const signupFormHandler = async (e) => {
    e.preventDefault();
    // console.log(formState.inputs);
    setFormData(
      {
        name: {
          value: formState.inputs.name.value,
          isValid: true,
        },
        surname: {
          value: formState.inputs.surname.value,
          isValid: true,
        },
        birthdate: {
          value: formState.inputs.birthdate.value,
          isValid: true,
        },
      },
      true
    );
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/friends",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          surname: formState.inputs.surname.value,
          birthdate: formState.inputs.birthdate.value,
          image: share.friendImage,
          owner: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate(`/${auth.userId}/friends`);
    } catch (err) {
      SetError(true)
    }
  };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      {
        <form
          className="form__container-addcar addfriend"
          onSubmit={signupFormHandler}
        >
          <div className="form-content info-car">
            <FriendPhoto />
            <Input
              id="name"
              element="input"
              type="text"
              label="Имя"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Имя"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              classNameWrapper="inputWrapper"
            />

            <Input
              id="surname"
              element="input"
              type="text"
              label="Фамиля"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="Фамиля"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              classNameWrapper="inputWrapper"
            />
            <Input
              id="birthdate"
              element="input"
              type="text"
              label="День рождения"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="День рождения"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              classNameWrapper="inputWrapper"
            />
          </div>

          <div className={"button_container"}>
            <Button type="submit" inverse disabled={!formState.isValid}>
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

export default AddFriend;
