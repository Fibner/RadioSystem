import axios from "axios";
import { Link, redirect, useNavigate } from "react-router-dom";
import { config } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../data/userActions"
import "../css/LoginAvatar.css";
import { useEffect, useState } from "react";

export const LoginAvatar = () => {
  const user = useSelector((state) => state);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  function logout() {
    axios
      .get(config.url.API_URL + "/discord/logout", { withCredentials: true })
      .then((response) => {
        if(response.data.loggedOut){
          dispatch(logoutUser())
          navigate("/");
        };
      })
  }
  return (
    <li className="li" id="avatar" onClick={logout}>
      <div id="name-div"> {user ? user.username : null}</div>
      <div id="logout-div">Wyloguj</div>
    </li>
  );
};
