import "./css/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Components/Login";
import { Home } from "./Components/Home";
import { Privacy } from "./Components/Privacy";
import { AddSong } from "./Components/AddSong";

function App() {
  const [user, setUser] = useState();
  fetch("http://localhost:4999/api/auth", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      //todo tu trzeba coś z tym json pomyśleć
      if (response.status === 200)
        return response.json().then((json) => setUser(json.user));
      if (response.status === 403) return console.log("nie zalogowany");
      throw new Error("authentication has been failed!");
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <div id="navbar">.</div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/privacy" element={<Privacy />}></Route>
          <Route path="/add" element={<AddSong />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;