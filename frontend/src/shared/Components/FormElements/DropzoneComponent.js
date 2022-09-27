import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import cloud from "../../../assets/icons/uploadCloud.svg";
import CircularStaticSingle from "../../services/CircularStaticSingle";

import trash_blue from "../../../assets/icons/trash-blue.svg";
import renew from "../../../assets/icons/renew.svg";
import X from "../../../assets/icons/x.svg";
import plus from "../../../assets/icons/plus.svg";

import "./DropzoneComponent.css";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#fff",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

//Convert Size of Image
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

function DropzoneComponent(props) {
  const [files, setFiles] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setShowDropzone(true);
    let pickedFile;
    let fileIsValid = isValid;

    const imagefiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((curr) => [...curr, ...imagefiles]);

    const imageArray = Array.from(acceptedFiles).map((file) => file);

    if (imageArray && imageArray.length !== 0) {
      setIsValid(true);
      fileIsValid = true;
      pickedFile = imageArray;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg ",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const deleteHandler = (removeName) => {
    setFiles((list) => list.filter(({ name }) => name !== removeName));
    console.log(files.length);
    if (files.length === 1) {
      setShowDropzone(false);
    }
  };

  const cancelHandler = () => {};

  const thumbs = files.map((file) => (

    <div className={`preview-wrapper ${props.classPreview}`} key={uuidv4()}>
      <div
        className={`preview-img-wrapper mobile-img-wrapper ${props.classPreviewImg}`}
      >
        <img src={file.preview} alt={file.name} />
        {!props.loadingFilter && (
          <div className="loading-filter">
            {props.isLoading && (
              <div className="img_icon-wrapper-drop" onClick={cancelHandler}>
                <CircularStaticSingle progress={props.percentage} />
                <img
                  src={X}
                  className="photo-circle-text"
                  alt="x icon"
                  onClick={props.Cancel}
                />
              </div>
            )}

            <div
              className={
                !props.showRenew ? "input-hidden" : "img_icon-wrapper-drop"
              }
            >
              <img src={renew} alt="renew" onClick={props.renewHandler} />
            </div>
          </div>
        )}
      </div>

      <div className={`preview-info ${props.classPrewiewinfo}`}>
        <div>
          <p className={`preview-info-name ${props.classPrewiewname}`}>
            {file.name.slice(0, -4)}
          </p>
          <p className={`preview-info-desc ${props.classPrewiewdesc}`}>
            {formatBytes(file.size)}, {file.type.slice(6)}
          </p>
        </div>
        <div onClick={() => deleteHandler(file.name)}>
          <img
            src={trash_blue}
            alt="trash"
            className={!props.showDelete ? "input-hidden" : "trash_bank"}
            onClick={props.deleteHandler}
          />
        </div>
      </div>
    </div>
  ));


  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file));
    },
    [files]
  );

  return (
    <section
      className={`dropzone-container`}
      style={files.length > 0 ? { marginBottom: "40px" } : null}
    >
      <div
        {...getRootProps({ style })}
        className={
          !showDropzone && !props.initials 
            ? `dropzone-wrapper ${props.dropclassName}`
            : `dropzone-wrapper small ${props.dropclassName}`
        }
      >
        <input {...getInputProps()} id={props.id} name={props.name} />

        <div className={`dropzone-content ${props.dropcontentclass}`}>
          <img src={cloud} alt='cloud'/>
          {!showDropzone ? (
            <p className={"input-desc"}>
              Перетащите или <span>выберите файл</span>
            </p>
          ) : (
            <p className={"input-desc"}>Добавить ещё файл</p>
          )}
          <p className={"input-sub-desc"}>JPG или PNG, не более 30 мб</p>
        </div>

        <div className="dropzone-mob">
          <img src={plus} alt="plus" />
          <div className="dropzone-mob-content">
            <p className={"input-desc-mobile"}>Загрузить файл</p>
            <p className={"input-sub-desc"}>JPG или PNG, не более 30 мб</p>
          </div>
        </div>
      </div>
      
      {thumbs}
      {props.initials}

      
    </section>
  );
}

export default DropzoneComponent;
