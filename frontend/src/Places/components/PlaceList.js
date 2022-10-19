import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import Likes from "./Likes";
import { FaRegTrashAlt } from "react-icons/fa";

import "./PlaceList.css";

const PlaceList = (props) => {
  const auth = useContext(AuthContext);
  const { pathname } = useLocation();
  const { sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setLoadedUsers(responseData.users);
        //console.log(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);
  const getUser = (x) => {
    if (loadedUsers) {
      return loadedUsers.find((user) => user.id === x);
    }
  };
  
  return (
    <div className="placelist_container">
      <div className="placelist_wrapper">
        {props.loading && (
          <div className="loading-wrapper">
            <i className="fa fa-circle-o-notch fa-spin"></i>
          </div>
        )}

        {props.places.length >= 1 &&
          props.places.map((el, index) => (
            <div className="place_item-wrapper" id={el.id} key={el.id}>
              <div className="place_info head-content">
                <NavLink
                  className={"place_owner_image-wrapper"}
                  to={`/${el.owner}/userplace`}
                >
                  {loadedUsers && (
                    <img
                      className={"place_owner_image"}
                      src={
                        process.env.REACT_APP_ASSETS_URL +
                        `${loadedUsers ? getUser(el.owner).image : ' /'}`
                      }
                      alt={el.owner}
                    />
                  )}
                </NavLink>

                <div className="head-content-desc">
                  <p className="place_author">
                    {/* {loadedUsers && getUser(el.owner).name} */}
                  </p>
                  <p className="place_title">{el.title}</p>
                </div>
              </div>
              <div className="place_image_wrapper">
                <img
                  className={"place_image"}
                  src={process.env.REACT_APP_ASSETS_URL + `${el.image}`}
                  alt={el.title}
                />
              </div>
              <div className="place_info footer-content">
                <h3>{el.address}</h3>
                <p>{el.description}</p>
              </div>
              {auth.userId === el.owner && (
                <div className="place_item-delete-btn" onClick={props.onDelete}>
                  <FaRegTrashAlt />
                </div>
              )}
              <Likes disabled={auth.userId === el.owner} place={el.id} places={props.places} user={el.owner} />
            </div>
          ))}
      </div>
      <ModalPlace show={props.confirmDelete} CloseOnClick={props.close}>
        <div className="place_delete-wrapper">
          <h3>Вы точно хотите удалить?</h3>
          <div className="place_delete-btns">
            <button
              onClick={props.setConfirmDelete}
              disabled={auth.userId === userId}
            >
              Отмена
            </button>
            <button
              onClick={props.setIdOfDeleteItem}
              disabled={auth.userId === userId}
            >
              {!props.loading ? (
                "Удалить"
              ) : (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              )}
            </button>
          </div>
        </div>
      </ModalPlace>
    </div>
  );
};

export default PlaceList;
