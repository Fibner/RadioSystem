import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { config } from "../Constants";

export const UsersList = () => {
  const [users, setUsers] = useState(null);
  const WS_URL = config.url.WS_URL;
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendJsonMessage({ type: "admin", new: true, cb: "users"});
    },
    shouldReconnect: (closeEvent) => true,
    onMessage: (message) => {
      const json = JSON.parse(message.data);
      // console.log(json);
      if (json.users) {
        // console.log(json.users)
        setUsers(json.users)
      }
    },
  });

  return <div>
    {users?users.map((user)=>{
        return (<div style={{display: "flex", alignItems: "center"}}><span><img style={{maxWidth: 25+'px'}} src={user.picture_url} alt="profile_pic"/></span><span>{user.name}</span></div>)
    }):null}
  </div>;
};
