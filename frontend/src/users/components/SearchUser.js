import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./SearchUser.css";

const SearchUser = () => {
  const auth = useContext(AuthContext);
  //const userId = useParams().userId;
  const { sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users`
        );
        // const filterList = responseData.users.filter(
        //   (user) => user.id === userId
        // )[0].friendList;
        // const friendArr = responseData.users.filter((user) =>
        //   filterList.includes(user.id)
        // );
        // console.log(filterList)
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);
  return <div></div>;
};

export default SearchUser;
