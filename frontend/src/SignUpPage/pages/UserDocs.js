import React, {useState, useContext, useEffect,useCallback} from "react";

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { SignUpContext } from "../../shared/context/signup-context";
import { useHttpClient } from '../../shared/hooks/http-hook';
import axios from 'axios';
import Button from '../../shared/Components/FormElements/Button';
import { useWindowDimensions } from '../../shared/hooks/useWindowDimensions';
import {useForm} from '../../shared/hooks/SignUpFrom-hook';
import DropzoneComponent from "../../shared/Components/FormElements/DropzoneComponent";
import SendError from "../components/SendError";

import { FaArrowLeft } from "react-icons/fa";
import './UserDocs.css';
import './SignUpPage.css'

const UserDocs = () => {

    const SignUp = useContext(SignUpContext);
    const navigate = useNavigate();
    const {isLoading, sendRequest } = useHttpClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState([]);
    const [theArray, setTheArray] = useState([]);
    const [percentage, setUploadPercentage] = useState(0);
    const [showDelete, setDelete] = useState(false);
    const [showRenew, setShowRenew] = useState(false);
    const [errorUpload, setErrorUpload] = useState(false);
    const [errorSend, setErrorSend]  =  useState(false);
    const [formState, inputHandler] = useForm({

        docs: {
            value: null,
            isValid: false
          }
    });
     
    const uploadphotos = formState.inputs.docs.value;
    const infos = [];
    
    const uploadImage = useCallback(() => {
        
        if(!uploadphotos) return;
        const uploadPhoto =  async () => {
        setDelete(true)
        await uploadphotos.map( async file => {
            const formData = new FormData();
            formData.append('uploadImages', file);

        try {
         await axios.post(process.env.REACT_APP_BACKEND_URL +'/users/userdocs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
            
          }
        }).then(response => {
            setTheArray(prevArray => [...prevArray, response.data.data[0]])
            setImageFile(...imageFile, response.data.data[0].path)
            infos.push(response.data.data[0])
             setLoading(true);
          
          
        });
        
      }
      
      catch (err) {
        setLoading(false)
        setShowRenew(true);
        setErrorUpload(true);  
        SignUp.error = err.message;
        if (err.response.status === 500) {
          console.log('There was a problem with the server');
        }
      }
    })
    }
    uploadPhoto();

    },[formState.inputs.docs.value])

    useEffect(() => {
        uploadImage()
    }, [uploadImage]);


    const deleteHandler = async (e) => {
        const alt = e.target.parentElement.parentElement.parentElement.children[0].children[0].alt
        const updatedArray = theArray.filter(img => img.originalname !== alt);
        const deletedItem = theArray.filter(img => img.originalname === alt)[0].path;
        setTheArray(updatedArray)

        try {
            await sendRequest(
              process.env.REACT_APP_BACKEND_URL +`/users/userphoto`,
              'DELETE',
              JSON.stringify({
                image: deletedItem,
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            
          } catch (err) {}
          
    }

    const sendPhoto = async (e) => {

        e.preventDefault();
        let pathInfo = [];
        theArray.map((file)=> {
            pathInfo.push(file.path)
        })

        if((formState.inputs.docs.value === null)) return

        const userId = SignUp.userId;

        try {
            
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL +`/users/userdocs/${userId}`,
              'PATCH',
              JSON.stringify({
                docs: pathInfo,
              }),
              {
                'Content-Type': 'application/json'
              }
            );

            navigate('/signup/success'); 
            
          } catch (err) {
            setErrorSend(true);
            SignUp.error = true;
            console.log(SignUp.error)
          }

          window.scrollTo({top: 0, behavior: 'smooth'});
          setPositionUp(true);
    };

    
    const renewHandler = async() => {
        setShowRenew(false);
        setErrorUpload(false)
        
        try{
            const formData = new FormData();
            formData.append('image', formState.inputs.docs.value);
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL +'/users/userphoto',
              'POST',
              formData,
            );
            setImageFile(responseData.data.path)
            setDelete(true);
        } catch (err) {
            if(formState.inputs.docs.value !== null) setShowRenew(true)
        }
    };

     //After submit scroll butoon up

     const [positionUp, setPositionUp] = useState(false);
     const { height } = useWindowDimensions();
     const style_button = {top:height-234, position:"absolute"};


    return (
        <React.Fragment>
            {errorUpload ? <SendError sendError ="Не удалось загрузить фото"/> : null}
            {errorSend ? <SendError sendError ="Не удалось продолжить регистрацию. Попробуйте ещё раз"/> : null}
            
            <form className="form__container-dropzone photo-wrapper-dropzone" onSubmit={sendPhoto}>
            <div className={"form__container-head photo-wrapper-head"}>
                <p className={"form__container-head-subtitle"}>Шаг 3 из 3</p>
                <h1 className={"form__container-head-title"}>Загрузите документы</h1>
                <p className={"form__container-head-desc"}>Разворот паспорта и страницу с пропиской, а также водительское удостоверение с двух сторон</p>
            </div>
            <Link to="/userphoto">
                <p className={"form__container-backArrow"}>
                <i className={'fa'}><FaArrowLeft /></i>Назад</p>
            </Link>
            {/* <DropzoneApp /> */}

            <DropzoneComponent 
                id="docs"
                name="uploadImages"
                onInput={inputHandler}
                deleteHandler = {deleteHandler}
                Cancel={deleteHandler}
                isLoading= {loading}
                loadingFilter={loading}
                showDelete ={showDelete}
                showRenew={showRenew}
                renewHandler={renewHandler}
                percentage={percentage}
            />

            <div className={"button-container"} style = {positionUp ? style_button : null} > 
                <Button 
                  type="submit"
                  className="button-docs"
                  inverseClass= "button-photo"
                  onClick={sendPhoto}
                  disabled={!showDelete}
                  inverse 
                >
                  {!isLoading ? "Зарегистрироваться" : <i className="fa fa-circle-o-notch fa-spin"></i>} 
                </Button>
            </div>
        </form>
        </React.Fragment>
       
        
    );
};

export default UserDocs;


