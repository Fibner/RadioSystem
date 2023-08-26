import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { config } from "../Constants";
import "../css/Home.css";
import logo from "../pictures/fblogo.png";
export const Home = () => {
  const user = useSelector((state) => state);
  function loginFacebook() {
    window.open(config.url.API_URL + "/facebook", "_self");
  }
  const navigate = useNavigate();
  // useEffect(() => {
  //   axios.get(config.url.API_URL + "/api/auth",{withCredentials: true})
  //     .then((response) => {
  //       return console.log(response);
  //     })
  // });
  if (user) {
    return navigate("/");
  } else {
    return (
      <div id="welcome-text">
        Aby dodać piosenke lub zobaczyc historie zaloguj się!
        <br />
        <div>
          {/* <img src={logo} alt="Facebook logo" /> */}
          <input
            className={"login-btn"}
            type={"button"}
            value="Zaloguj się przez Facebook"
            onClick={loginFacebook}
          />
        </div>
      </div>
    );
  }
};
