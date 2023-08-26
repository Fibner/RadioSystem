import "./css/App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  redirect,
  Route,
  Routes,
} from "react-router-dom";
import { Home } from "./Components/Home";
import { Privacy } from "./Components/Privacy";
import { AddSong } from "./Components/AddSong";
import { config } from "./Constants";
import { Navbar } from "./Components/Navbar";
import { History } from "./Components/History";
import { useDispatch, useSelector } from "react-redux";
import { Player } from "./Components/Player";
import { fetchUser } from "./data/userActions";
import store from "./data/store";
import { UsersList } from "./Components/UsersList";
import {RequestsList} from "./Components/RequestsList"
import { ControlPanel } from "./Components/ControlPanel";
import { SongsList } from "./Components/SongsList";

function App() {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  const add = "/add";
  const history = "/history";
  const users = "/users"
  const requests = "/requests";
  const panel = "/panel";
  const songs = "/songs";
  const player = "/player/secretpasswordthatnobodyknows";

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="" element={!user?<Home />:<Navigate to={add}/>} />
          <Route path={add} element={user?<AddSong />:<Navigate to={"/"}/>}></Route>
          <Route path={history} element={user?<History />:<Navigate to={"/"}/>}></Route>
          <Route
            path={player}
            element={<Player />}
          />
          <Route path="/privacy" element={<Privacy />}></Route>
          <Route path="/*" element={<Navigate to={"/"} />}></Route>
          <Route path={users} element={user?user.admin?<UsersList/>:<Navigate to={"/"}/>:<Navigate to={"/"}/>}></Route>
          <Route path={requests} element={user?user.admin?<RequestsList></RequestsList>:<Navigate to={"/"}/>:<Navigate to={"/"}/>}></Route>
          <Route path={panel} element={user?user.admin?<ControlPanel></ControlPanel>:<Navigate to={"/"}/>:<Navigate to={"/"}/>}></Route>
          <Route path={songs} element={user?user.admin?<SongsList></SongsList>:<Navigate to={"/"}/>:<Navigate to={"/"}/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
