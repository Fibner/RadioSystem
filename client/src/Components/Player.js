import YouTube from "react-youtube";
import { config } from "../Constants";
import axios from "axios";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";

export const Player = () => {
  // const [state, setState] = useState(null);
  const [player, setPlayer] = useState();

  // const ws = new WebSocket(config.url.WS_URL)
  const WS_URL = config.url.WS_URL;
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendJsonMessage({ type: "player", new: true });
    },
    onClose: () => {
      emergency();
    },
    // onError: () => {
    //   emergency();
    // },
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: Infinity,
    onMessage: (message) => {
      const json = JSON.parse(message.data);
      // console.log("26:",json);
      if (json.songID) {
        player.loadVideoById(json.songID);
        if (json.brake) player.playVideo();
        else player.pauseVideo();
      }
      if (json.state) {
        switch (json.state) {
          case "play":
            console.log("prośba o odciszenie");
            unmuteSong();
            break;
          case "pause":
            console.log("probśba o wyciszenie");
            muteSong();
            break;
          case "stop":
            emergency();
            break;
          default:
            sendJsonMessage({ state: player ? player.getPlayerState() : -1 });
            break;
        }
      }
      if (json.command) {
        switch (json.command) {
          case "unmute":
            unmuteSong();
            return;
          case "mute":
            mutePlayer();
            return;
          default:
            return;
        }
      }
    },
  });

  const opts = {
    // height: '390',
    // width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      enablejsapi: 1,
      rel: 0,
      disablekb: 1,
      fs: 0,
    },
  };

  function onPlayerReady(e) {
    setPlayer(e.target);
    sendJsonMessage({ playerReady: true });
  }
  function onStateChange(e) {
    // console.log(e.data);
    if (e.data === 0) {
      sendJsonMessage({ state: 0 });
    } else if (e.data === 1) {
      sendJsonMessage({ state: 1 });
    } else if (e.data === 2) {
      sendJsonMessage({ state: 2 });
    } else if (e.data === -1) {
    }
  }
  function muteSong() {
    if (!player) return;
    // sendJsonMessage({ state: 2 });
    console.log("wyciszanko");
    const mute = setInterval(() => {
      player.setVolume(player.getVolume() - 1);
      if (player.getVolume() === 0) {
        clearInterval(mute);
        player.pauseVideo();
      }
    }, 50);
  }
  function unmuteSong() {
    if (!player) return;
    // sendJsonMessage({ state: 1 });
    console.log("odciszanko");
    if(player.isMuted()) player.unMute()
    player.playVideo();
    const unmute = setInterval(() => {
      player.setVolume(player.getVolume() + 2);
      if (player.getVolume() === 100) {
        clearInterval(unmute);
      }
    }, 100);
  }
  function emergency() {
    if (!player) return;
    console.log("emergency");
    player.stopVideo();
  }
  function mutePlayer(){

  }
  function unmutePlayer(){

  }

  return (
    <div>
      <div id="player">
        <YouTube
          opts={opts}
          // videoId={"CVpUuw9XSjY"}
          onReady={(e) => onPlayerReady(e)}
          onStateChange={(e) => onStateChange(e)}
          onError={(e) => console.log(e)}
        />
      </div>
    </div>
  );
};
