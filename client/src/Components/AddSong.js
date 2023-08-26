import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { config } from "../Constants";
import axios from "axios";
import { useSelector } from "react-redux";
import "../css/Add.css";
export const AddSong = () => {
  const user = useSelector((state) => state);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    window.name = "Dodaj piosenkę - Radiowęzeł";
  }, []);

  function addRequest() {
    if (
      !link
        .trim()
        .replace(" ", "")
        .includes("https://www.youtube.com/watch?v=") &&
      !link.trim().replace(" ", "").includes("https://youtu.be/") &&
      !link.trim().replace(" ", "").includes("https://m.youtube.com/")
    ) {
      return setStatus("Niepoprawny Link do Youtube");
    }
    let temp = link.slice(-11);
    if (temp.length !== 11) {
      return setStatus("Błędny link");
    }
    setLink("");
    setStatus("Dodawanie...");
    axios
      .post(
        config.url.API_URL + "/api/addSong",
        { url: temp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        switch (response.status) {
          case 200:
            console.log("Piosenkę dodano");
            setStatus("Dodano piosenkę do bazy");
            break;
          case 403:
            console.log("Nie jesteś zalogowany!");
            setStatus("Nie jesteś zalogowany");
            break;
          case 406:
            console.log("Zły link!");
            setStatus("Zły link");
            break;
          case 500:
            console.log("Błąd serwera");
            setStatus(
              "Problemy techniczne z serwerem, spróbuj ponownie później"
            );
            break;
          default:
            break;
        }
        return;
      })
      .catch((err) => {
        switch (err.response.status) {
          case 403:
            console.log("Nie jesteś zalogowany!");
            setStatus("Nie jesteś zalogowany");
            break;
          case 406:
            console.log("Zły link!");
            setStatus("Zły link");
            break;
          case 500:
            console.log("Błąd serwera");
            setStatus(
              "Problemy techniczne z serwerem, spróbuj ponownie później"
            );
            break;
          default:
            setStatus("Problemy techniczne z serwerem, spróbuj ponownie później");
            break;
        }
        return;
      });
  }
    return (
      <div style={{ textAlign: "center" }}>
        <div>Dodaj piosenkę:</div>
        <input
          type={"text"}
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
          onFocus={() => {
            setStatus("");
          }}
          className={"link-input"}
        />
        <br />
        
        <input
          type={"button"}
          onClick={() => addRequest()}
          value="Dodaj"
          className="link-button"
        />
        <br />
        <div>{status}</div>
      </div>
    );
};
