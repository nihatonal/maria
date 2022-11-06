import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import Likes from "./Likes";
import Comments from "./Comments";
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
      {props.loading && (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      )}
      {!props.gridview ? (
        <div className="photo_grid_view">
          {props.places.length >= 1 &&
            props.places.map((place, i) => (
              <NavLink
                to={`/places/${place.id}`}
                key={place.id}
                className="photo_grid_view-item"
                id={place.id}
              >
                <img src={process.env.REACT_APP_ASSETS_URL + place.image} />
              </NavLink>
            ))}
        </div>
      ) : (
        <div className="placelist_wrapper">
          {props.places.length >= 1 &&
            props.places.map((el, index) => (
              <div className="place_item-container" key={el.id}>
                <div className="place_item-wrapper" id={el.id}>
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
                            `${loadedUsers ? getUser(el.owner).image : " /"}`
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
                    <div
                      className="place_item-delete-btn"
                      onClick={props.onDelete}
                    >
                      <FaRegTrashAlt />
                    </div>
                  )}
                  <Likes
                    disabled={auth.userId === el.owner}
                    place={el.id}
                    places={props.places}
                    user={el.owner}
                  />
                </div>
                <Comments
                  places={props.places}
                  user={auth.userId}
                  token={auth.token}
                  placeId={el.id}
                  users={loadedUsers}
                />
              </div>
            ))}
        </div>
      )}
      <ModalPlace show={props.confirmDelete} CloseonClick={props.close}>
        <div className="place_delete-wrapper">
          <h3>Вы точно хотите удалить?</h3>
          <div className="place_delete-btns">
            <button onClick={props.setConfirmDelete}>Отмена</button>
            <button onClick={props.setIdOfDeleteItem}>
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
