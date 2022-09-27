import React, { useState, useContext, useEffect, useCallback } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";
import Button from "../../shared/Components/FormElements/Button";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import DropzoneComponent from "../../shared/Components/FormElements/DropzoneComponent";
import { AuthContext } from "../../shared/context/auth-context";
import SendError from "../../SignUpPage/components/SendError";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./AddCarImages.css";

const AddCarDocs = (props) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [theArray, setTheArray] = useState([]);
  const [percentage, setUploadPercentage] = useState(0);
  const [showDelete, setDelete] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);

  const [carInfo, setCarInfo] = useState();
  const [options, setOptions] = useState();
  const [services, setServices] = useState();
  const [carImages, setCarImages] = useState();
  const [owner, setOwner] = useState();

  const [errorSend, setErrorSend] = useState(false);
  const [formState, inputHandler] = useForm({
    images: {
      value: null,
      isValid: false,
    },
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("carData"));
    const storedOptions = JSON.parse(localStorage.getItem("carOptions"));
    const storedImages = JSON.parse(localStorage.getItem("carImages"));
    setOwner(auth.userId);
    setCarInfo(storedData);
    setOptions(storedOptions.options);
    setServices(storedOptions.services);
    setCarImages(storedImages);
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
              setTheArray((prevArray) => [...prevArray, response.data.data[0]]);
              setImageFile(...imageFile, response.data.data[0].path);
              infos.push(response.data.data[0]);
              setLoading(true);
            });
        } catch (err) {
          setLoading(false);
          setShowRenew(true);
          setErrorUpload(true);
          setErrorSend(true)
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
        process.env.REACT_APP_BACKEND_URL +'/users/userphoto',
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

  const backHandler = () => {
    let pathInfo = [];
    theArray.map((file) => {
      pathInfo.push(file);
    });
  };

  const sendPhoto = async (e) => {
    e.preventDefault();

    let pathInfo = [];
    theArray.map((file) => {
      pathInfo.push(file.path);
    });

    // if (formState.inputs.images.value === null) return;

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +"/cars",
        "POST",
        JSON.stringify({
          brand: carInfo.brand,
          model: carInfo.model,
          year: carInfo.year,
          plate_number: carInfo.plate_number,
          vin_number: carInfo.vin_number,
          car_body: carInfo.car_body,
          color: carInfo.color,
          engine_type: carInfo.engine_type,
          engine_volume: parseFloat(carInfo.engine_volume).toFixed(1),
          engine_power: carInfo.engine_power,
          engine_transmission: carInfo.engine_transmission,
          engine_run: carInfo.engine_run,
          pts: carInfo.pts,
          sts: carInfo.sts,
          price: carInfo.price,
          price_for3: carInfo.price_for3,
          price_more5: carInfo.price_more5,
          policy: carInfo.policy,
          insurance: carInfo.insurance,
          options: options,
          services: services,
          images: carImages.pathInfo,
          carDocs: pathInfo,
          owner: owner,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      localStorage.removeItem("carData");
      localStorage.removeItem("carOptions");
      localStorage.removeItem("carImages");
      navigate(`/${auth.userId}/success`);
    } catch (err) {}

    window.scrollTo({ top: 0, behavior: "smooth" });
    setPositionUp(true);
  };

  const renewHandler = async () => {
    setShowRenew(false);
    setErrorUpload(false);

    try {
      //   const formData = new FormData();
      //   formData.append("image", formState.inputs.images.value);
      //   const responseData = await sendRequest(
      //     "http://localhost:5000/api/users/userphoto",
      //     "POST",
      //     formData
      //   );
      //   setImageFile(responseData.data.path);
      //   setDelete(true);
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

      <form
        className="form__container-dropzone photo-wrapper-dropzone add-car-docs-form"
        onSubmit={sendPhoto}
      >
        <div
          className={
            "form__container-head photo-wrapper-head add-car-docs-content"
          }
        >
          <p className={"form__container-head-subtitle"}>Шаг 4 из 4</p>
          <h1 className={"form__container-head-title"}>Фото документов</h1>
          <p className={"form__container-head-desc"}>
            СТС или ПТС автомобиля, полис ОСАГО, полис КАСКО (если есть)
          </p>
        </div>
        <div
          className={"form__container-backArrow-wrapper"}
          onClick={props.onClick}
        >
          <p className={"form__container-backArrow"} onClick={backHandler}>
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
            disabled={!showDelete}
            inverse
          >
            {!isLoading ? (
              "Добавить автомобиль"
            ) : (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            )}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default AddCarDocs;
