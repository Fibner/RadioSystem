import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { config } from "../Constants";

export const SongsList = ()=>{
    const [songs, setSongs] = useState(null);
    const WS_URL = config.url.WS_URL;
    const { sendJsonMessage } = useWebSocket(WS_URL, {
      onOpen: () => {
        sendJsonMessage({ type: "admin", new: true, cb: "songs"});
      },
      shouldReconnect: (closeEvent) => true,
      onMessage: (message) => {
        const json = JSON.parse(message.data);
        if (json.songs) {
          setSongs(json.songs)
        }
      },
    });
    function deleteSong(id){
        sendJsonMessage({action: "delete", songId: id})
    }
    return(
        <div>
            {songs?
            songs.map((item)=>{
                return <><div key={item.songId}><a href={item.link} target="_blank">{item.title}</a><input type="button" value="Usuń" onClick={()=>deleteSong(item.songId)}/></div><br/></>;
            })
            :"Brak"}
        </div>
    );
}