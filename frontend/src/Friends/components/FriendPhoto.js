import React, { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { SignUpContext } from "../../shared/context/signup-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import ImageUpload from "../../shared/Components/FormElements/ImageUpload";
import { ShareContext } from "../../shared/context/share-contex";
import camera from "../../assets/icons/camera.svg";
import "./FriendPhoto.css";

const FriendPhoto = (path) => {
  const SignUp = useContext(SignUpContext);
  const share = useContext(ShareContext);
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setimageFile] = useState(null);
  const [showDelete, setDelete] = useState(false);
  const [showRenew, setShowRenew] = useState(false);

  const [formState, inputHandler] = useForm({
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
        share.friendImage = responseData.data.path;
      } catch (err) {
        if (formState.inputs.image.value !== null) {
          setShowRenew(true);
        }
      }
    };

    uploadPhoto();
  }, [formState.inputs.image.value, sendRequest, SignUp.error]);



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
      <div className="image-upload-wrapper">
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
      </div>
      {/* <div className={"button-container"}>
          <Button
            type="submit"
            onClick={sendPhoto}
            disabled={!showDelete}
            inverse
          >
            {!loading ? (
              "Продолжить"
            ) : (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            )}
          </Button>
        </div> */}
    </React.Fragment>
  );
};

export default FriendPhoto;
