import React, { useState, useEffect, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./UsersList.css";

const UsersList = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);

  const [loadedUsers, setLoadedUsers] = useState();

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
  }, [auth.token]);
  return (
    <div>
      {loading ? (
        <div className="loading-wrapper">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UsersList;
