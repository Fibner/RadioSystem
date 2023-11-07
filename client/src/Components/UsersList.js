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
      if (json.users) {
        setUsers(json.users)
      }
    },
  });

  return <div>
    {users?users.map((user)=>{
      console.log(user);
        return (<div style={{display: "flex", alignItems: "center"}}><span><img style={{maxWidth: 25+'px'}} src={"https://cdn.discordapp.com/avatars/"+user.discordId+"/"+user.avatar} alt="profile_pic"/></span><span>{user.username}</span></div>)
    }):null}
  </div>;
};
