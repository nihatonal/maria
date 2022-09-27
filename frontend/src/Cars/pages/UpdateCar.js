import React, { useEffect, useState } from "react";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";
import { useParams } from "react-router-dom";
import menu_dropdown from "../../assets/icons/menu-down.svg";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";

import Cardb from "../../assets/cardb.json";
import Infocars from "../../assets/infocars.json";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import UpdateOptionCar from "../components/UpdateOptionCar";
import Select from "../../shared/Components/FormElements/Select";

import "../components/AddCar.css";

const UpdateCar = () => {
  const { sendRequest } = useHttpClient();
  const [stepOne, setStepOne] = useState(true); //true
  const [stepTwo, setStepTwo] = useState(false); //false
  const [error, SetError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCar, setLoadedCar] = useState();
  const [initialStatus, setInitialStatus] = useState(false);
  const carId = useParams().cid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      brand: {
        value: "",
        isValid: true,
      },
      model: {
        value: "",
        isValid: true,
      },
      year: {
        value: "",
        isValid: false,
      },
      plate_number: {
        value: "",
        isValid: false,
      },
      vin_number: {
        value: "",
        isValid: false,
      },
      car_body: {
        value: "",
        isValid: true,
      },
      color: {
        value: "",
        isValid: true,
      },
      engine_type: {
        value: "",
        isValid: true,
      },
      engine_volume: {
        value: "",
        isValid: false,
      },
      engine_power: {
        value: "",
        isValid: false,
      },
      engine_transmission: {
        value: "",
        isValid: true,
      },
      engine_run: {
        value: "",
        isValid: false,
      },
      pts: {
        value: "",
        isValid: false,
      },
      sts: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      price_for3: {
        value: "",
        isValid: false,
      },
      price_more5: {
        value: "",
        isValid: false,
      },
      policy: {
        value: "",
        isValid: false,
      },
      insurance: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const calcHorsePower = (x) => {
    return (x / 1.36).toFixed(3);
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +`/cars/${carId}`
        );
        //console.log(responseData.car);
        setLoadedCar(responseData.car);
        localStorage.setItem(
          "carOptions",
          JSON.stringify({
            options: responseData.car.options,
            services: responseData.car.services,
          })
        );
        setFormData(
          {
            brand: {
              value: responseData.car.brand.value,
              isValid: true,
            },
            model: {
              value: responseData.car.model.value,
              isValid: true,
            },
            year: {
              value: responseData.car.year.value,
              isValid: true,
            },
            plate_number: {
              value: responseData.car.plate_number.value,
              isValid: true,
            },
            vin_number: {
              value: responseData.car.vin_number.value,
              isValid: true,
            },
            color: {
              value: responseData.car.color.value,
              isValid: true,
            },
            car_body: {
              value: responseData.car.car_body.value,
              isValid: true,
            },
            engine_type: {
              value: responseData.car.engine_type.value,
              isValid: true,
            },
            engine_volume: {
              value: responseData.car.engine_volume.value,
              isValid: true,
            },
            engine_power: {
              value: responseData.car.engine_power.value,
              isValid: true,
            },
            engine_transmission: {
              value: responseData.car.engine_transmission.value,
              isValid: true,
            },
            engine_run: {
              value: responseData.car.engine_run.value,
              isValid: true,
            },
            pts: {
              value: responseData.car.pts.value,
              isValid: true,
            },
            sts: {
              value: responseData.car.sts.value,
              isValid: true,
            },
            price: {
              value: responseData.car.price.value,
              isValid: true,
            },
            price_for3: {
              value: responseData.car.price_for3.value,
              isValid: true,
            },
            price_more5: {
              value: responseData.car.price_more5.value,
              isValid: true,
            },
            policy: {
              value: responseData.car.policy.value,
              isValid: true,
            },
            insurance: {
              value: responseData.car.insurance.value,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, carId, setFormData]);

  const brandItems = [
    ...new Set([].concat(Cardb.map((item) => item.brand)).flat()),
  ];

  let selectedModels;

  selectedModels = [
    ...new Set(
      []
        .concat(
          Cardb.filter((auto) =>
            auto.brand.includes(formState.inputs.brand.value)
          ).map((item) => item.model)
        )
        .flat()
    ),
  ];

  const signupFormHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setFormData(
      {
        brand: {
          value: formState.inputs.brand.value,
          isValid: true,
        },
        model: {
          value: formState.inputs.model.value,
          isValid: true,
        },
        year: {
          value: formState.inputs.year.value,
          isValid: true,
        },
        plate_number: {
          value: formState.inputs.plate_number.value,
          isValid: true,
        },
        vin_number: {
          value: formState.inputs.vin_number.value,
          isValid: true,
        },
        color: {
          value: formState.inputs.color.value,
          isValid: true,
        },
        car_body: {
          value: formState.inputs.car_body.value,
          isValid: true,
        },
        engine_type: {
          value: formState.inputs.engine_type.value,
          isValid: true,
        },
        engine_volume: {
          value: formState.inputs.engine_volume.value,
          isValid: true,
        },
        engine_power: {
          value: formState.inputs.engine_power.value,
          isValid: true,
        },
        engine_transmission: {
          value: formState.inputs.engine_transmission.value,
          isValid: true,
        },
        engine_run: {
          value: formState.inputs.engine_run.value,
          isValid: true,
        },
        pts: {
          value: formState.inputs.pts.value,
          isValid: true,
        },
        sts: {
          value: formState.inputs.sts.value,
          isValid: true,
        },
        price: {
          value: formState.inputs.price.value,
          isValid: true,
        },
        price_for3: {
          value: formState.inputs.price_for3.value,
          isValid: true,
        },
        price_more5: {
          value: formState.inputs.price_more5.value,
          isValid: true,
        },
        policy: {
          value: formState.inputs.policy.value,
          isValid: true,
        },
        insurance: {
          value: formState.inputs.insurance.value,
          isValid: true,
        },
      },
      true
    );
    try {
      localStorage.setItem(
        "carData",
        JSON.stringify({
          brand: loadedCar.brand,
          model: loadedCar.model,
          year: loadedCar.year,
          plate_number: formState.inputs.plate_number.value,
          vin_number: loadedCar.vin_number,
          car_body: loadedCar.car_body,
          color: loadedCar.color,
          engine_type: loadedCar.engine_type,
          engine_volume: loadedCar.engine_volume,
          engine_power: loadedCar.engine_power,
          engine_transmission: loadedCar.engine_transmission,
          engine_run: formState.inputs.engine_run.value,
          pts: loadedCar.pts,
          sts: loadedCar.sts,
          price: formState.inputs.price.value,
          price_for3: formState.inputs.price_for3.value,
          price_more5: formState.inputs.price_more5.value,
          policy: formState.inputs.policy.value,
          insurance: formState.inputs.insurance.value,
        })
      );

      setTimeout(() => {
        setStepOne(false);
        setStepTwo(true);
      }, 2000);
    } catch (err) {
      SetError(true);
      setIsLoading(false);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setPositionUp(true);
  };

  const stepTwoHandler = () => {
    setStepOne(true);
    setStepTwo(false);
    setIsLoading(false);
    setPositionUp(false);
    setInitialStatus(true)
  };

  //After submit scroll butoon up

  const [positionUp, setPositionUp] = useState(false);
  const { height } = useWindowDimensions();
  const style_button = { top: height - 234, position: "absolute" };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      {stepOne && loadedCar && (
        <form className="form__container-addcar" onSubmit={signupFormHandler}>
          <div className={"form__container-head"}>
            <p className={"form__container-head-subtitle"}>Шаг 1 из 4</p>
            <h1 className={"form__container-head-title"}>Редактировать автомобиль</h1>
          </div>

          <div className="form-content info-car">
            <h2>Информация об автомобиле</h2>

            <Input
              id="brand"
              element="select"
              label="Марка"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              //initialValue={loadedCar.brand}
              initialValid={true}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={brandItems}
                value={loadedCar.brand || formState.inputs.brand.value}
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>

            <Input
              id="model"
              element="select"
              label="Модель"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.model.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={selectedModels}
                value={loadedCar.model || formState.inputs.model.value}
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>

            <Input
              id="year"
              element="input"
              type="text"
              label="Год выпуска"
              validators={[
                VALIDATOR_REQUIRE(),
                VALIDATOR_NUMBER(),
                VALIDATOR_MAXLENGTH(4),
              ]}
              onInput={inputHandler}
              placeholder="0000"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={loadedCar.year || formState.inputs.year.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none',color:'#e0e0e0'}}
            />
            <Input
              id="plate_number"
              element="input"
              type="text"
              label="Гос. номер"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="А000АА000"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={!initialStatus ?
                loadedCar.plate_number : formState.inputs.plate_number.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
            <Input
              id="vin_number"
              element="input"
              type="text"
              label="VIN"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="ABCD1234567890"
              placeholderclassName="input-hidden"
              className="br-grey"
              initialValue={
                loadedCar.vin_number || formState.inputs.vin_number.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none',color:'#e0e0e0'}}
            />
            <Input
              id="color"
              element="select"
              label="Цвет"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={loadedCar.color || formState.inputs.color.value}
              initialValid={true}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={Infocars[0].color}
                value={loadedCar.color || formState.inputs.color.value}
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>
            <Input
              id="car_body"
              element="select"
              label="Кузов"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={
                loadedCar.car_body || formState.inputs.car_body.value
              }
              initialValid={true}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={Infocars[3].carbody}
                value={loadedCar.car_body || formState.inputs.car_body.value}
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>
            <Input
              id="engine_type"
              element="select"
              label="Тип двигателя"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={
                loadedCar.engine_type || formState.inputs.engine_type.value
              }
              initialValid={true}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={Infocars[1].engine}
                value={
                  loadedCar.engine_type || formState.inputs.engine_type.value
                }
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>

            <Input
              id="engine_volume"
              element="input"
              type="text"
              label="Объем"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholder="1,0 л"
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={
                loadedCar.engine_volume || formState.inputs.engine_volume.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none',color:'#e0e0e0'}}
            />
            <div className="engine_power">
              <span>Мощность</span>
              <Input
                id="engine_power"
                element="input"
                type="text"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
                onInput={inputHandler}
                placeholder="100 л.с."
                placeholderclassName="input-hidden"
                errorTextclassName="input-hidden"
                className="input-power br-grey"
                initialValue={
                  loadedCar.engine_power || formState.inputs.engine_power.value
                }
                initialValid={true}
                classNameWrapper="input-small"
                style={{pointerEvents:'none',color:'#e0e0e0'}}
              />
              <p className="engine_power_kw">
                {calcHorsePower(
                  loadedCar.engine_power || formState.inputs.engine_power.value
                )}
              </p>
            </div>

            <Input
              id="engine_transmission"
              element="select"
              label="Трансмиссия"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={
                loadedCar.engine_transmission ||
                formState.inputs.engine_transmission.value
              }
              initialValid={true}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none'}}
            >
              <Select
                data={Infocars[2].transmission}
                value={
                  loadedCar.engine_transmission ||
                  formState.inputs.engine_transmission.value
                }
                styleSelectInput={{ color:'#e0e0e0'}}
              />
            </Input>

            <Input
              id="engine_run"
              element="input"
              type="text"
              label="Пробег"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
              placeholder="10 000 км"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={ !initialStatus ? 
                loadedCar.engine_run : formState.inputs.engine_run.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
            <Input
              id="pts"
              element="input"
              type="text"
              label="Серия и номер ПТС"
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="00 АА 000000"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="br-grey"
              initialValue={loadedCar.pts || formState.inputs.pts.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
              style={{pointerEvents:'none',color:'#e0e0e0'}}
            />
            <Input
              id="sts"
              element="input"
              type="text"
              label="Серия и номер СТС"
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="00 АА 000000"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="br-grey"
              initialValue={!initialStatus ? loadedCar.sts : formState.inputs.sts.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
          </div>

          <div className="form-content info-rent">
            <h2>Стоимость аренды</h2>
            <Input
              id="price"
              element="input"
              type="text"
              label="Обычная цена"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
              placeholder="1 500 ₽/сутки"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={!initialStatus ? loadedCar.price : formState.inputs.price.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
            <Input
              id="price_for3"
              element="input"
              type="text"
              label="Цена при аренде на 3 дня"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
              placeholder="1 400 ₽/сутки"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={!initialStatus ? 
                loadedCar.price_for3 : formState.inputs.price_for3.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
            <Input
              id="price_more5"
              element="input"
              type="text"
              label="Цена при аренде более 5 дней"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
              placeholder="1 300 ₽/сутки"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="input-short br-grey"
              initialValue={!initialStatus ?
                loadedCar.price_more5 : formState.inputs.price_more5.value
              }
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
          </div>

          <div className="form-content info-insurance">
            <h2>Страхование</h2>
            <Input
              id="policy"
              element="input"
              type="text"
              label="Полис ОСАГО"
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="XXX 000000000"
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              className="br-grey"
              initialValue={!initialStatus ? loadedCar.policy : formState.inputs.policy.value}
              initialValid={true}
              classNameWrapper="inputWrapper"
            />
            <div className="container-insurance">
              <Input
                id="insurance"
                element="input"
                type="text"
                label="Полис КАСКО (если есть)"
                placeholder="XXX 000000000"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                placeholderclassName="input-hidden"
                className="br-grey"
                initialValue={!initialStatus ?
                  loadedCar.insurance : formState.inputs.insurance.value
                }
                initialValid={true}
                classNameWrapper="inputWrapper"
              />
              <Button to="./" className="buy_kasko">
                Купить КАСКО
              </Button>
            </div>
          </div>

          <div
            className={"button-container"}
            style={positionUp ? style_button : null}
          >
            <Button type="submit" inverse disabled={!formState.isValid}>
              {!isLoading ? (
                "Продолжить"
              ) : (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </Button>
          </div>
        </form>
      )}
      {stepTwo && <UpdateOptionCar onClick={stepTwoHandler} />}
    </>
  );
};

export default UpdateCar;
