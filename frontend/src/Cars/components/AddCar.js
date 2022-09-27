import React, { useEffect, useState } from "react";
import Input from "../../shared/Components/FormElements/Input";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";

import menu_dropdown from "../../assets/icons/menu-down.svg";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";

import Cardb from "../../assets/cardb.json";
import Infocars from "../../assets/infocars.json";
import { useForm } from "../../shared/hooks/SignUpFrom-hook";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import AddOptionCar from "./AddOptionCar";
import Select from "../../shared/Components/FormElements/Select";

import "./AddCar.css";

const AddCar = () => {
  //const { sendRequest } = useHttpClient();
  const [stepOne, setStepOne] = useState(true); //true
  const [stepTwo, setStepTwo] = useState(false); //false
  const [error, SetError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [selectedItem, setSelectedItem] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      brand: {
        value: "Audi",
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
        value: "Седан",
        isValid: true,
      },
      color: {
        value: "Белый",
        isValid: true,
      },
      engine_type: {
        value: "Бензин",
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
        value: "Автомат / Передний привод",
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
    // return (Number(x.split("л")[0]) / 1.36).toFixed(3);
    return (x / 1.36).toFixed(3);
  };

  const brandItems = [
    ...new Set([].concat(Cardb.map((item) => item.brand)).flat()),
  ];

  useEffect(() => {
    setSelected([
      ...new Set(
        []
          .concat(
            Cardb.filter((auto) =>
              auto.brand.includes(formState.inputs.brand.value)
            ).map((item) => item.model)
          )
          .flat()
      ),
    ]);

    setSelectedItem(
      [
        ...new Set(
          []
            .concat(
              Cardb.filter((auto) =>
                auto.brand.includes(formState.inputs.brand.value)
              ).map((item) => item.model)
            )
            .flat()
        ),
      ][0]
    );
  }, [formState.inputs.brand.value]);

  const OnChangeModel = (e) => {
    setSelectedItem(e.target.value);
  };

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
          brand: formState.inputs.brand.value,
          model: selectedItem,
          year: formState.inputs.year.value,
          plate_number: formState.inputs.plate_number.value,
          vin_number: formState.inputs.vin_number.value,
          car_body: formState.inputs.car_body.value,
          color: formState.inputs.color.value,
          engine_type: formState.inputs.engine_type.value,
          engine_volume: formState.inputs.engine_volume.value,
          engine_power: formState.inputs.engine_power.value,
          engine_transmission: formState.inputs.engine_transmission.value,
          engine_run: formState.inputs.engine_run.value,
          pts: formState.inputs.pts.value,
          sts: formState.inputs.sts.value,
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
      {stepOne && (
        <form className="form__container-addcar" onSubmit={signupFormHandler}>
          <div className={"form__container-head"}>
            <p className={"form__container-head-subtitle"}>Шаг 1 из 4</p>
            <h1 className={"form__container-head-title"}>Новый автомобиль</h1>
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
              initialValue={formState.inputs.brand.value}
              initialValid={formState.inputs.brand.isValid}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
            >
              <Select data={brandItems} value={formState.inputs.brand.value} />
            </Input>

            <Input
              id="model"
              element="select"
              label="Модель"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.model.value}
              initialValid={formState.inputs.model.isValid}
              classNameWrapper="inputWrapper"
            >
              <Select
                data={selected}
                value={selected && selectedItem}
                onChange={OnChangeModel}
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
              initialValue={formState.inputs.year.value}
              initialValid={formState.inputs.year.isValid}
              classNameWrapper="inputWrapper"
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
              initialValue={formState.inputs.plate_number.value}
              initialValid={formState.inputs.plate_number.isValid}
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
              initialValue={formState.inputs.vin_number.value}
              initialValid={formState.inputs.vin_number.isValid}
              classNameWrapper="inputWrapper"
            />
            <Input
              id="color"
              element="select"
              label="Цвет"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.color.value}
              initialValid={formState.inputs.color.isValid}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
            >
              <Select
                data={Infocars[0].color}
                value={formState.inputs.color.value}
              />
            </Input>
            <Input
              id="car_body"
              element="select"
              label="Кузов"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.car_body.value}
              initialValid={formState.inputs.car_body.isValid}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
            >
              <Select
                data={Infocars[3].carbody}
                value={formState.inputs.car_body.value}
              />
            </Input>
            <Input
              id="engine_type"
              element="select"
              label="Тип двигателя"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.engine_type.value}
              initialValid={formState.inputs.engine_type.isValid}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
            >
              <Select
                data={Infocars[1].engine}
                value={formState.inputs.engine_type.value}
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
              initialValue={formState.inputs.engine_volume.value}
              initialValid={formState.inputs.engine_volume.isValid}
              classNameWrapper="inputWrapper"
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
                initialValue={formState.inputs.engine_power.value}
                initialValid={formState.inputs.engine_volume.isValid}
                classNameWrapper="input-small"
              />
              <p className="engine_power_kw">
                {calcHorsePower(formState.inputs.engine_power.value)}
              </p>
            </div>

            <Input
              id="engine_transmission"
              element="select"
              label="Трансмиссия"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              placeholderclassName="input-hidden"
              initialValue={formState.inputs.engine_transmission.value}
              initialValid={formState.inputs.engine_transmission.isValid}
              src={menu_dropdown}
              classNameWrapper="inputWrapper"
            >
              <Select
                data={Infocars[2].transmission}
                value={formState.inputs.engine_transmission.value}
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
              initialValue={formState.inputs.engine_run.value}
              initialValid={formState.inputs.engine_run.isValid}
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
              initialValue={formState.inputs.pts.value}
              initialValid={formState.inputs.pts.isValid}
              classNameWrapper="inputWrapper"
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
              initialValue={formState.inputs.sts.value}
              initialValid={formState.inputs.sts.isValid}
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
              initialValue={formState.inputs.price.value}
              initialValid={formState.inputs.price.isValid}
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
              initialValue={formState.inputs.price_for3.value}
              initialValid={formState.inputs.price_for3.isValid}
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
              initialValue={formState.inputs.price_more5.value}
              initialValid={formState.inputs.price_more5.isValid}
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
              initialValue={formState.inputs.policy.value}
              initialValid={formState.inputs.policy.isValid}
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
                initialValue={formState.inputs.insurance.value}
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
      {stepTwo && <AddOptionCar onClick={stepTwoHandler} />}
    </>
  );
};

export default AddCar;
