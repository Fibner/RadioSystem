import { LoginAvatar } from "./LoginAvatar";
import "../css/Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { config } from "../Constants";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../data/userActions";

export const Navbar = () => {
  const user = useSelector((state) => state);
  const add = "/add";
  const history = "/history";
  const requests = "/requests";
  const songs = "/songs";
  const users = "/users";
  const panel = "/panel";

  return (
    <div>
      <ul className="ul">
        {user ? <LoginAvatar></LoginAvatar> : null}
        <div id="menu">
          <NavLink to={add}>
            <li className="li">Dodaj</li>
          </NavLink>
          <NavLink to={history}>
            <li className="li">Historia</li>
          </NavLink>
          {user?user.admin ? (
            <NavLink to={panel}>
              <li className="li">Panel</li>
            </NavLink>
          ) : null:null}
          {user?user.admin ? (
            <NavLink to={requests}>
              <li className="li">Prośby</li>
            </NavLink>
          ) : null:null}
          {user?user.admin ? (
            <NavLink to={songs}>
              <li className="li">Lista</li>
            </NavLink>
          ) : null:null}
          {user?user.admin ? (
            <NavLink to={users}>
              <li className="li">Użytkownicy</li>
            </NavLink>
          ) : null:null}
        </div>
      </ul>
    </div>
  );
};
