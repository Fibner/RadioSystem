import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { config } from "../Constants";

export const ControlPanel = () => {
    const [song, setSong] = useState(null)
    const WS_URL = config.url.WS_URL;
    const { sendJsonMessage } = useWebSocket(WS_URL, {
      onOpen: () => {
        sendJsonMessage({ type: "admin", new: true, cb: "panel"});
      },
      shouldReconnect: (closeEvent) => true,
      onMessage: (message) => {
        const json = JSON.parse(message.data);
        console.log(json);
        if (json.song) {
            setSong(json.song);
        }
      },
    });
    function nextSong(){
        sendJsonMessage({action: "next"});
    }
    function unmuteSong(){
      sendJsonMessage({action: "unmute"});
    }
  return <div>
        <div>{song?"Aktualnie leci: "+song:"Nic nie leci"}</div>
        {/* <div><input type="button" value="Zatrzymaj"/></div>
        <div><input type="button" value="Wznów"/></div> */}
        <div><input type="button" value="Następne" onClick={()=>nextSong()}/></div>
        <div><input type="button" value="Odcisz" onClick={()=>unmuteSong()}/></div>
  </div>;
};
