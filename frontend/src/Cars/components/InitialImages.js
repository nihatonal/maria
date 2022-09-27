import React from "react";
import { v4 as uuidv4 } from "uuid";

import trash_blue from "../../assets/icons/trash-blue.svg";
import plus from "../../assets/icons/plus.svg";

const InitialImages = (props) => {
  return (
    <div className={`preview-wrapper ${props.classPreview}`} key={uuidv4()} >
      <div
        className={`preview-img-wrapper mobile-img-wrapper ${props.classPreviewImg}`}
      >
        <img src={process.env.REACT_APP_ASSETS_URL +`${props.file}`} alt={props.file} />
      </div>

      <div className={`preview-info ${props.classPrewiewinfo}`}>
        <div>
          <p className={`preview-info-name ${props.classPrewiewname}`}>
            Ex-{props.file.slice(15,23)}
          </p>
          <p className={`preview-info-desc ${props.classPrewiewdesc}`}>
            78 kB, JPG
          </p>
        </div>
        <div onClick={props.onDelete} >
          <img
            src={trash_blue}
            alt="trash"
            className={"trash_bank"}

          />
        </div>
      </div>
    </div>
  );
};

export default InitialImages;
