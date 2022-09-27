import React, { useState, useContext, useEffect, useCallback } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";
import Button from "../../shared/Components/FormElements/Button";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import DropzoneComponent from "../../shared/Components/FormElements/DropzoneComponent";
import { AuthContext } from "../../shared/context/auth-context";
import SendError from "../../SignUpPage/components/SendError";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import InitialImages from "./InitialImages";
import "./AddCarImages.css";

const UpdateCarDocs = (props) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const carId = useParams().cid;
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
  const [initialDocs, setInitialDocs] = useState();

  const [errorSend, setErrorSend] = useState(false);
  const [formState, inputHandler] = useForm({
    images: {
      value: null,
      isValid: false,
    },
  });

  // useEffect(() => {
  //   const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
  //   if (selectedCar) {
  //     setInitialDocs(selectedCar[0].carDocs);
  //   }
  //   const initialDocs = selectedCar[0].carDocs;
  //   localStorage.setItem(
  //     "initialImages", 
  //     JSON.stringify({
  //       initialDocs,
  //     })
  //   );
  // }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("carData"));
    const storedOptions = JSON.parse(localStorage.getItem("carOptions"));
    const storedImages = JSON.parse(localStorage.getItem("carImages"));
    const storedInitial = JSON.parse(localStorage.getItem("initialImages"));
    setCarInfo(storedData);
    setOptions(storedOptions.options);
    setServices(storedOptions.services);
    if(storedInitial.updatedArray) {
      console.log(storedInitial.updatedArray);
      setCarImages(storedImages.pathInfo.concat(storedInitial.updatedArray));
    } else {
      console.log(storedInitial.initialImages);
      setCarImages(storedImages.pathInfo.concat(storedInitial.initialImages));
    }
    console.log(storedImages.pathInfo)
   
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

    const updatedArray = initialDocs.filter((img) => img !== deletedItem);
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

    setInitialDocs(updatedArray);
    console.log(updatedArray);

    localStorage.setItem(
      "initialDocs",
      JSON.stringify({
        updatedArray,
      })
    );
  };
  const backHandler = () => {
    // setStepThree(true);
    // setStepFour(false);
    setPositionUp(false);
  };


  const sendPhoto = async (e) => {
    e.preventDefault();

    let pathInfo = [];
    theArray.map((file) => {
      pathInfo.push(file.path);
    });


    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +`/cars/${carId}`,
        "PATCH",
        JSON.stringify({
          plate_number: carInfo.plate_number,
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
          images: carImages,
          carDocs: pathInfo
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      localStorage.removeItem("carData");
      localStorage.removeItem("carOptions");
      localStorage.removeItem("carImages");
      navigate(`/${auth.userId}/cars`);
      console.log(responseData)
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
            СТС или ПТС автомобиля, полис ОСАГО, полис КАСКО (Пожалуйста,
            добавьте новые)
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
          // initials={
          //   initialDocs &&
          //   initialDocs.map((image, index) => (
          //     <InitialImages
          //       file={image}
          //       key={index}
          //       onDelete={(e) => deleteInitialHandler(e)}
          //     />
          //   ))
          // }
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
            disabled={!initialDocs}
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

export default UpdateCarDocs;
