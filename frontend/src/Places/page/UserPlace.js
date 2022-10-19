import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareContext } from "../../shared/context/share-contex";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AddPlace from "../components/AddPlace";
import PlaceList from "../components/PlaceList";
import ModalPlace from "../../shared/Components/UIElements/ModalPlace";
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
           // console.log(res.data.places)
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
  }, [sendRequest, show]);

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

      <div className="btn-add-place-wrapper">
        {userId === auth.userId && (
          <button className="btn-add-place" onClick={() => setShow(true)}>
            Add Place
          </button>
        )}
      </div>

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
      />
    </div>
  );
};

export default UserPlace;
