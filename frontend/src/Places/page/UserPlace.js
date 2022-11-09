import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ShareContext } from "../../shared/context/share-contex";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AddPlace from "../components/AddPlace";
import PlaceList from "../components/PlaceList";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
import UserCard from "../../users/components/UserCard";
import Game from "../../MemoryGame/Game";
import FlashCards from "../../English/components/FlashCards";
import { AiOutlineTable } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import "./UserPlace.css";

const UserPlace = () => {
  const share = useContext(ShareContext);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [places, setPlaces] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [idOfDeleteItem, setIdOfDeleteItem] = useState();
  const [gridview, setGridview] = useState(false);
  const userId = useParams().userId;

  useEffect(() => {
    setLoading(true);

    const fetchPlaces = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res) {
            setPlaces(res.data.places);
            //console.log(res.data.places);
            setLoading(false);
          } else {
            setPlaces([]);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchPlaces();
  }, [sendRequest, show, userId]);

  const confirmDeleteHandler = async () => {
    setLoading(true);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${idOfDeleteItem}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const posts = places.filter((item) => item.id !== idOfDeleteItem);
      setPlaces(posts);
      setConfirmDelete(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="userplaces">
      <ModalPlace show={show} CloseonClick={() => setShow(false)}>
        <AddPlace
          submit={() => {
            if (!share.error) {
              setTimeout(() => setShow(false), 500);
            }
          }}
        />
      </ModalPlace>
      {loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : (
        <div className="userplaces-left-side">
          <UserCard />
          <div className="btns-add-place-wrapper">
            <AiOutlinePlusCircle
              className="btn-place add-place"
              onClick={() => setShow(true)}
              style={userId !== auth.userId ? { display: "none" } : null}
            />
            <AiOutlineTable
              onClick={() => setGridview(!gridview)}
              className="btn-place change-view"
            />
          </div>
          {!gridview ? (
            <div className="photo_grid_view">
              {places.map((place, i) => (
                <NavLink
                  to={`/${userId}/${place.id}`}
                  key={place.id}
                  className="photo_grid_view-item"
                >
                  <img
                    src={process.env.REACT_APP_ASSETS_URL + place.image}
                    alt="place_image"
                  />
                </NavLink>
              ))}
            </div>
          ) : (
            <PlaceList
              loading={loading}
              update={show}
              places={places}
              confirmDelete={confirmDelete}
              onDelete={(e) => {
                setIdOfDeleteItem(e.target.parentNode.id);
                setConfirmDelete(true);
              }}
              close={() => setConfirmDelete(false)}
              setConfirmDelete={() => setConfirmDelete(false)}
              setIdOfDeleteItem={() => confirmDeleteHandler(idOfDeleteItem)}
              gridview={gridview}
            />
          )}
        </div>
      )}
      {/* {!loading && (
        <div className="userplaces-right-side">
          <Game token={auth.token} userId={userId} />
        </div>
      )} */}
    </div>
  );
};

export default UserPlace;
