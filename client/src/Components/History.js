import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../Constants";

export const History = () => {
  const user = useSelector((state) => state);
  const [history, setHistory] = useState(null);
  useEffect(() => {
    axios
      .get(config.url.API_URL + "/api/getHistory", { withCredentials: true })
      .then((response) => {
        setHistory(response.data.history);
      });
  }, []);
  return <div>
    {history?history.map((song)=>{
      let date = new Date(song.playedDate);
      console.log(date.toISOString());
      return (<>{song.title+" | "}<span style={{color: "green"}}>{(new Date(song.playedDate).getDate()<10?'0':'')+new Date(song.playedDate).getDate()+"."+((new Date(song.playedDate).getMonth()+1)<10?'0':'')+(new Date(song.playedDate).getMonth()+1)+"."+new Date(song.playedDate).getFullYear()+", "+(new Date(song.playedDate).getHours()<10?'0':'')+new Date(song.playedDate).getHours()+":"+(new Date(song.playedDate).getMinutes()<10?'0':'')+new Date(song.playedDate).getMinutes()}</span><br/><br/></>)
    }):null}
  </div>;
};
