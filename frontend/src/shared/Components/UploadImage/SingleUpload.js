import React, { useRef, useState, useEffect } from 'react';

import CircularStaticSingle from '../../services/CircularStaticSingle';
import { useHttpClient } from '../../shared/hooks/http-hook';
import trash from '../../../assets/icons/trash.svg';
import renew from '../../../assets/icons/renew.svg';
import X from '../../../assets/icons/x.svg';

import './ImageUpload.css';

const ImageUpload = props => {
  const { isLoading, sendRequest } = useHttpClient();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);

  }, [file]);

  useEffect(() => {
    async function upload() {
      const url = await uploadFile(file, setProgress);
      onUpload(file, url);
    }

    upload();
  }, []);

  const onUpload = (file, progress) => {
    const formData = new FormData();
    formData.append(props.id, file);
    formData.append('image', formState.inputs.image.value);
    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL +'/users/userphoto',
      'POST',
      formData,
    );
  }

  const pickedHandler = event => {
   
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
    
  };  

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const deleteHandler = () => {
    setPreviewUrl(null);

  };

  const cancelHandler = () => {
    setPreviewUrl(null);
  };
 
  return (
    <div className="photo-input_wrapper">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
     
        <div className="image-upload__wrapper">
          {previewUrl && <img className='image-upload-preview' src={previewUrl} alt="Preview" />}
          {!previewUrl && 
          <div className={props.pickerClassname} onClick={pickImageHandler}>
            {props.picker}
          </div>
          }
          {previewUrl && !props.isLoading && <div className='filter'>
              <div className={ !props.isLoading  ? "input-hidden" : "img_icon-wrapper" } onClick={cancelHandler}>
                    <CircularStaticSingle  />
                  <img src={X} className="photo-circle-text" alt="x icon" onClick={props.Cancel}/>
              </div>
              <div className={!props.showDelete ? "input-hidden" : "img_icon-wrapper" } onClick={props.deleteHandler}>
                <img src={trash} alt="trash"  className={!props.showDelete? "input-hidden" : ""} onClick={deleteHandler}/>
              </div>
          </div>}

          <div className={!props.showRenew ? "input-hidden" : 'filter-renew'}>
            <div className={!props.showRenew ? "input-hidden" : "img_icon-wrapper" }>
                <img src={renew} alt="renew" onClick={props.renewHandler}/>
            </div>
          </div>    
        
        </div>

      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
