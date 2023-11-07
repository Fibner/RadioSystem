import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { config } from "../Constants";

export const RequestsList = ()=>{
    const [requests, setRequests] = useState(null);
    const WS_URL = config.url.WS_URL;
    const { sendJsonMessage } = useWebSocket(WS_URL, {
      onOpen: () => {
        sendJsonMessage({ type: "admin", new: true, cb: "requests"});
      },
      shouldReconnect: (closeEvent) => true,
      onMessage: (message) => {
        console.log(message);
        const json = JSON.parse(message.data);
        if (json.requests.length !== 0) {
          setRequests(json.requests)
        }else{
          setRequests(null);
        }
      },
    });
    function acceptRequest(id){
        sendJsonMessage({verdict: true, songId: id})
    }
    function decilneRequest(id){
        sendJsonMessage({verdict: false, songId: id})
    }
    return(
        <div>
            {requests?
            requests.map((item)=>{
                return <div key={item.songId}><a href={item.link} target="_blank">{item.title}</a><input type="button" value="V" onClick={()=>acceptRequest(item.songId)}/><input type="button" value="X" onClick={()=>decilneRequest(item.songId)}/></div>;
            })
            :"Brak"}
        </div>
    );
}