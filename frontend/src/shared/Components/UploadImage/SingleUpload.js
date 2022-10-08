import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { SignUpContext } from "../../context/signup-context";
import { useHttpClient } from "../../hooks/http-hook";
import { useForm } from "../../hooks/SignUpFrom-hook";
import ImageUpload from "../../Components/FormElements/ImagesUpload";


import { FaArrowLeft } from "react-icons/fa";
import camera from "../../../assets/icons/camera.svg";
// import "./SignUpPhoto.css";

const SingleUpload = () => {
  const SignUp = useContext(SignUpContext);
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setimageFile] = useState(null);
  const [showDelete, setDelete] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorSend, setErrorSend] = useState(false);
  const [formState, inputHandler, setFormData] = useForm({
    image: {
      value: null,
      isValid: false,
    },
  });

  useEffect(() => {
    const uploadPhoto = async () => {
      try {
        const formData = new FormData();
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/userphoto",
          "POST",
          formData
        );
        setimageFile(responseData.data.path);
        setDelete(true);
      } catch (err) {
        if (formState.inputs.image.value !== null) {
          SignUp.error = err.message;
          setShowRenew(true);
          setErrorUpload(true);
        }
      }
    };

    uploadPhoto();
  }, [formState.inputs.image.value, sendRequest, SignUp.error]);

  const sendPhoto = async (e) => {
    e.preventDefault();
    if (formState.inputs.image.value === null) return;

    const userId = SignUp.userId;
    setLoading(true);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/userphoto/${userId}`,
        "PATCH",
        JSON.stringify({
          image: imageFile,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      navigate("/signup/success");
    } catch (err) {
      setErrorSend(true);
      SignUp.error = true;
      console.log(SignUp.error);
      if (formState.inputs.image.value !== null) {
        SignUp.error = true;
        setLoading(false);
      }
    }
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/userphoto`,
        "DELETE",
        JSON.stringify({
          image: imageFile,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
    setDelete(false);
  };

  const renewHandler = async () => {
    setShowRenew(false);
    setErrorUpload(false);

    try {
      const formData = new FormData();
      formData.append("image", formState.inputs.image.value);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/userphoto",
        "POST",
        formData
      );
      setimageFile(responseData.data.path);
      setDelete(true);
    } catch (err) {
      if (formState.inputs.image.value !== null) setShowRenew(true);
    }
  };

  return (
    <React.Fragment>
      <ImageUpload
        center
        id="image"
        onInput={inputHandler}
        picker={<img src={camera} alt="camera" />}
        deleteHandler={deleteHandler}
        Cancel={deleteHandler}
        isLoading={isLoading && loading}
        showDelete={showDelete}
        showRenew={showRenew}
        renewHandler={renewHandler}
      />
    </React.Fragment>
  );
};

export default SingleUpload;
