import React  from "react";
import {
  useMeeting, useParticipant
} from "@videosdk.live/react-sdk";
import { Button } from "src/components/ui/button"
import EndIcon from "src/icons/EndIcon";
import MicOnIcon from "src/icons/MicOnIcon";
import MicOffIcon from "src/icons/MicOffIcon";
import WebcamOnIcon from "src/icons/WebcamOnIcon";
import WebcamOffIcon from "src/icons/WebcamOffIcon";
import ScreenShareIcon from "src/icons/ScreenShareIcon";

function Controls({isHost}) {
    const { leave, toggleMic, toggleWebcam, toggleScreenShare, localMicOn, localWebcamOn } = useMeeting();
    return (
      <div className="flex flex-row gap-3 bg-gray-400 rounded-md p-3">
        <Button onClick={() => leave()}><EndIcon fillcolor="red"/></Button>
        <Button onClick={() => toggleMic()}>{localMicOn? <MicOnIcon/> : <MicOffIcon />}</Button>
        <Button onClick={() => toggleWebcam()}>{localWebcamOn ? <WebcamOnIcon fillcolor="white"/>: <WebcamOffIcon fillcolor="white"/>}</Button>
        {isHost && <Button onClick={() => toggleScreenShare()}><ScreenShareIcon fillcolor="white"/></Button>}
      </div>
    );
  }

export default Controls;
  