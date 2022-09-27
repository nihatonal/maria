import React, { useCallback, useContext, useEffect, useState } from "react";

import OutsideClickHandler from "../../../shared/util/OutsideClickHandler";
import menu_dropdown from "../../../assets/icons/menu-down.svg";
import { useForm } from "../../../shared/hooks/SignUpFrom-hook";
import Input from "./Input";
import "./Select.css";

const Select = (props) => {
  const [showList, setShowList] = useState(false);
  const [formState, inputHandler] = useForm({})

  const onChangeHandler = (item) => {
    setShowList(false);
  };

  const focusHandler = () => {
    setShowList(true);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowList(false);
      }}
    >
      <Input
        id={props.id}
        element="select"
        label={props.label}
        onInput={inputHandler}
        placeholderclassName="input-hidden"
        className="br-grey"
        validators={props.validators}
        onClick={focusHandler}
        initialValue={props.initialValue}
        initialValid={props.initialValid}
      >
        {/* <label className="select-label">{props.label}</label> */}
        <img
          className="menu-dropdown"
          src={menu_dropdown}
          alt="menu-dropdown"
        />
        <p
          className={`select-input ${props.classSelectInput}`}
          onChange={props.onChange}
          onClick={focusHandler}
          id={props.id}
        >
          {props.initialValue}
        </p>
        {showList && (
          <div
            id="droplist"
            className="droplist-container"
            onClick={props.onClick}
          >
            {props.data.map((x, y) => (
              <div className="droplist-item" key={y}>
                <input
                  className="radio"
                  id={y}
                  type="radio"
                  name="selected-item"
                  value={x}
                  hidden
                />
                <label htmlFor={y} onClick={() => onChangeHandler(x)}>
                  {x}
                </label>
              </div>
            ))}
          </div>
        )}
      </Input>
      {/* <div className="select-wrapper"></div> */}
    </OutsideClickHandler>
  );
};

export default Select;



//   const formData = new FormData();
    //   formData.append("brand", formState.inputs.brand.value);
    //   formData.append("model", formState.inputs.model.value);
    //   formData.append("year", formState.inputs.year.value);
    //   formData.append("plate_number", formState.inputs.plate_number.value);
    //   formData.append("vin_number", formState.inputs.vin_number.value);
    //   formData.append("color", formState.inputs.color.value);
    //   formData.append("engine_type", formState.inputs.engine_type.value);
    //   formData.append("engine_volume", formState.inputs.engine_volume.value);
    //   formData.append("engine_power", formState.inputs.engine_power.value);
    //   formData.append("engine_transmission", formState.inputs.engine_transmission.value);
    //   formData.append("engine_run", formState.inputs.engine_run.value);
    //   formData.append("pts", formState.inputs.pts.value);
    //   formData.append("sts", formState.inputs.sts.value);
    //   formData.append("price", formState.inputs.price.value);
    //   formData.append("price_for3", formState.inputs.price_for3.value);
    //   formData.append("price_more5", formState.inputs.price_more5.value);
    //   formData.append("policy", formState.inputs.policy.value);
    //   formData.append("insurance", formState.inputs.insurance.value);
    //   formData.append("owner", auth.userId);
    //   const responseData = await sendRequest("http://localhost:5000/api/cars", "POST", formData, {
    //     Authorization: "Bearer " + auth.token,
    //   });





   // try {
      //   const responseData = await sendRequest(
      //     "http://localhost:5000/api/cars",
      //     "POST",
      //     JSON.stringify({
      //       brand: carInfo.brand,
      //       model: carInfo.inputs.model,
      //       year: carInfo.inputs.year,
      //       plate_number: carInfo.inputs.plate_number,
      //       vin_number: carInfo.inputs.vin_number,
      //       color: carInfo.inputs.color,
      //       engine_type: carInfo.inputs.engine_type,
      //       engine_volume: carInfo.inputs.engine_volume,
      //       engine_power: carInfo.inputs.engine_power,
      //       engine_transmission: carInfo.inputs.engine_transmission,
      //       engine_run: carInfo.inputs.engine_run,
      //       pts: carInfo.inputs.pts,
      //       sts: carInfo.inputs.sts,
      //       price: carInfo.price,
      //       price_for3: carInfo.inputs.price_for3,
      //       price_more5: carInfo.inputs.price_more5,
      //       policy: carInfo.inputs.policy,
      //       insurance: carInfo.inputs.insurance,
      //       owner: owner,
      //     }),
      //     {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + auth.token,
      //     }
      //   );
      //   console.log(responseData);
      //   navigate("/user/mycars/success");
      // } catch (err) {
      //   setErrorSend(true);
      // }
