import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Likes from "../components/Likes";
import Comments from "../components/Comments";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import { FaRegTrashAlt } from "react-icons/fa";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const placeId = useParams().pid;
  const userId = useParams().userId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [idOfDeleteItem, setIdOfDeleteItem] = useState();
  const navigate = useNavigate();
  const [loadedPlace, setLoadedPlace] = useState([]);
  const [loadedUser, setLoadedUser] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
        );
        // console.log([responseData.place]);
        setLoadedPlace(responseData.place);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, placeId]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        //console.log(responseData.user);
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setLoading(true);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${loadedPlace.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setConfirmDelete(false);
      setLoading(false);
      navigate(`/${userId}/userplace`);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="photo-item">
      <div className="photo-item-container" key={loadedPlace.id}>
        <div className="photo-item-wrapper" id={loadedPlace.id}>
          <div className="photo-item_head-content">
            {loadedUser && (
              <NavLink
                className={"photo_owner_image-wrapper"}
                to={`/user/${loadedPlace.owner}/`}
              >
                <img
                  className={"photo_owner_image"}
                  src={process.env.REACT_APP_ASSETS_URL + `${loadedUser.image}`}
                  alt={loadedUser.name}
                />
                <h4>{loadedUser.name}</h4>
              </NavLink>
            )}
          </div>
          <div className="photo_image_wrapper">
            <img
              className={"photo_image"}
              src={
                loadedPlace.image &&
                process.env.REACT_APP_ASSETS_URL + `${loadedPlace.image}`
              }
              alt={loadedPlace.title}
            />
          </div>
          <div className="photo_info">
            <h3 className="photo_title">{loadedPlace.title}</h3>
            <p>{loadedPlace.description}</p>
            <p>{loadedPlace.address}</p>
            {auth.userId === loadedPlace.owner ? (
              <div
                className="photo_item-delete-btn"
                onClick={() => setShow(true)}
              >
                <FaRegTrashAlt />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Likes
        disabled={auth.userId === loadedPlace.owner}
        user={loadedPlace.owner}
      />
      <Comments
        places={props.places}
        user={auth.userId}
        token={auth.token}
        placeId={loadedPlace.id}
      />
      <ModalPlace show={show} CloseonClick={() => setShow(false)}>
        <div className="photo_delete-wrapper">
          <h3>Вы точно хотите удалить?</h3>
          <div className="photo_delete-btns">
            <button onClick={() => setShow(false)}>Отмена</button>
            <button onClick={confirmDeleteHandler}>
              {!loading ? (
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

export default PlaceItem;
