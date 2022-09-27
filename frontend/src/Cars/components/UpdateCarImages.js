import React, { useState, useEffect, useCallback } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";
import Button from "../../shared/Components/FormElements/Button";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import InitialImages from "./InitialImages";
import DropzoneComponent from "../../shared/Components/FormElements/DropzoneComponent";
import SendError from "../../SignUpPage/components/SendError";
import UpdateCarDocs from "./UpdateCarDocs";
import { FaArrowLeft } from "react-icons/fa";

import "./AddCarImages.css";

const UpdateCarImages = (props) => {
  const { sendRequest } = useHttpClient();
  const [is_Loading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [theArray, setTheArray] = useState([]);
  const [percentage, setUploadPercentage] = useState(0);
  const [showDelete, setDelete] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [stepThree, setStepThree] = useState(true); //true
  const [stepFour, setStepFour] = useState(false); //false
  const [errorSend, setErrorSend] = useState(false);
  const [initialImages, setInitialImages] = useState();
  const [formState, inputHandler] = useForm({
    images: {
      value: null,
      isValid: false,
    },
  });

  useEffect(() => {
    const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    if (selectedCar) {
      setInitialImages(selectedCar[0].images);
    }
    const initialImages = selectedCar[0].images;
    localStorage.setItem(
      "initialImages",
      JSON.stringify({
        initialImages,
      })
    );
  }, []);

  const uploadphotos = formState.inputs.images.value;
  const infos = [];

  const uploadImage = useCallback(() => {
    if (!uploadphotos) return;
    const uploadPhoto = async () => {
      setDelete(true);

      await uploadphotos.map(async (file) => {
        const formData = new FormData();
        formData.append("uploadImages", file);

        try {
          await axios
            .post(process.env.REACT_APP_BACKEND_URL +"/users/userdocs", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                setUploadPercentage(
                  parseInt(
                    Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                  )
                );
              },
            })
            .then((response) => {
              console.log(response.data.data[0].path);
              setTheArray((prevArray) => [...prevArray, response.data.data[0]]);
              setImageFile(...imageFile, response.data.data[0].path);
              infos.push(response.data.data[0]);
              setLoading(true);
            });
        } catch (err) {
          setLoading(false);
          setShowRenew(true);
          setErrorUpload(true);
          if (err.response.status === 500) {
            console.log("There was a problem with the server");
          }
        }
      });
    };
    uploadPhoto();
}, [formState.inputs.images.value]);

  useEffect(() => {
    uploadImage();
  }, [uploadImage]);

  const deleteHandler = async (e) => {
    const alt =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .alt;
    const updatedArray = theArray.filter((img) => img.originalname !== alt);
    const deletedItem = theArray.filter((img) => img.originalname === alt)[0]
      .path;
    setTheArray(updatedArray);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +"/users/userphoto",
        "DELETE",
        JSON.stringify({
          image: deletedItem,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };

  const deleteInitialHandler = async (e) => {
    const deletedItem =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .alt;
    console.log(deletedItem);

    const updatedArray = initialImages.filter((img) => img !== deletedItem);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +"/users/userphoto",
        "DELETE",
        JSON.stringify({
          image: deletedItem,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}

    setInitialImages(updatedArray);
    console.log(updatedArray);

    localStorage.setItem(
      "initialImages",
      JSON.stringify({
        updatedArray,
      })
    );
  };

  const backHandler = () => {
    setStepThree(true);
    setStepFour(false);
    setIsLoading(false);
    setPositionUp(false);
  };

  const sendPhoto = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let pathInfo = [];
    theArray.map((file) => {
      pathInfo.push(file.path);
    });

    console.log(pathInfo)
    try {
      localStorage.setItem(
        "carImages",
        JSON.stringify({
          pathInfo,
        })
      );
      setTimeout(() => {
        setStepThree(false);
        setStepFour(true);
      }, 2000);
    } catch (err) {
      setErrorSend(true);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setPositionUp(true);
  };

  const renewHandler = async () => {
    setShowRenew(false);
    setErrorUpload(false);

    let pathInfo = [];
    theArray.map((file) => {
      pathInfo.push(file.path);
    });

    try {
      localStorage.setItem(
        "carImages",
        JSON.stringify({
          pathInfo,
        })
      );
      setStepThree(false);
      setStepFour(true);
    } catch (err) {
      if (formState.inputs.images.value !== null) setShowRenew(true);
    }
  };

  //After submit scroll button up

  const [positionUp, setPositionUp] = useState(false);
  const { height } = useWindowDimensions();
  const style_button = { top: height - 234, position: "absolute" };

  return (
    <React.Fragment>
      {errorUpload ? <SendError sendError="Не удалось загрузить фото" /> : null}
      {errorSend ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}

      {stepThree && (
        <form
          className="form__container-dropzone photo-wrapper-dropzone add-car-docs-form"
          onSubmit={sendPhoto}
        >
          <div
            className={
              "form__container-head photo-wrapper-head add-car-docs-content"
            }
          >
            <p className={"form__container-head-subtitle"}>Шаг 3 из 4</p>
            <h1 className={"form__container-head-title"}>Фото автомобиля</h1>
            <p className={"form__container-head-desc"}>
              Чем больше качественных фотографий вы загрузите, тем выше шанс
              того, что выберут ваш автомобиль.
            </p>
          </div>
          <div
            className={"form__container-backArrow-wrapper"}
            onClick={props.onClick}
          >
            <p className={"form__container-backArrow"}>
              <i className={"fa"}>
                <FaArrowLeft />
              </i>
              Назад
            </p>
          </div>

          <DropzoneComponent
            id="images"
            name="uploadImages"
            onInput={inputHandler}
            deleteHandler={deleteHandler}
            Cancel={deleteHandler}
            isLoading={loading}
            loadingFilter={loading}
            showDelete={showDelete}
            showRenew={showRenew}
            renewHandler={renewHandler}
            percentage={percentage}
            initialValue={formState.inputs.images.value}
            initialValid={formState.inputs.images.isValid}
            initials={
              initialImages &&
              initialImages.map((image, index) => (
                <InitialImages
                  file={image}
                  key={index}
                  onDelete={(e) => deleteInitialHandler(e)}
                />
              ))
            }
          />

          <div
            className={"button-container"}
            style={positionUp ? style_button : null}
          >
            <Button
              type="submit"
              className="button-docs"
              inverseClass="button-photo"
              onClick={sendPhoto}
              inverse
            >
              {!is_Loading ? (
                "Продолжить"
              ) : (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </Button>
          </div>
        </form>
      )}

      {stepFour && <UpdateCarDocs onClick={backHandler} />}
    </React.Fragment>
  );
};

export default UpdateCarImages;
