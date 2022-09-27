import React,{useContext} from "react";

import Logo from "../../shared/Components/Navigation/Logo";
import Button from "../../shared/Components/FormElements/Button";
import Success from "../../assets/images/addcarsuccess.png";
import { AuthContext } from "../../shared/context/auth-context";

import "./AddCarSuccess.css";

const SignUpSuccess = () => {
  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
      <Logo />
      <div className="container-success">
        <img src={Success}  alt={'Success'}/>

        <h2 className="container-success-title">Успех!</h2>

        <p className="container-success-text">
          Автомобиль добавлен. Дождитесь, когда указанная вами информация
          пройдёт проверку модераторами.
        </p>

        <Button size={" button--big"} to={`/${auth.userId}/cars`}>
          Перейти на главную
        </Button>
      </div>
    </React.Fragment>
  );
};

export default SignUpSuccess;
