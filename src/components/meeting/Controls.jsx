import React, {useState}  from "react";
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
import { Switch } from "src/components/ui/switch"

function Controls({isHost, toggleCode}) {
    const { leave, toggleMic, toggleWebcam, toggleScreenShare, localMicOn, localWebcamOn } = useMeeting({
      onSpeakerChanged: (activeSpeakerId) => {
        console.log("Active Speaker participantId", activeSpeakerId);
      },
    });
    const [switchStatus, setSwitchStatus] = useState(false);

    const switchStatusChanged = async (status) => {
      console.log(status);
      setSwitchStatus(status);
      toggleCode(status);
    }

    return (
      <div className="flex flex-row gap-3 shadow-lg rounded-md p-3">
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => leave()}><EndIcon fillcolor="red"/></Button>
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleMic()}>{localMicOn? <MicOnIcon fillcolor="black"/> : <MicOffIcon />}</Button>
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleWebcam()}>{localWebcamOn ? <WebcamOnIcon fillcolor="black"/>: <WebcamOffIcon fillcolor="white"/>}</Button>
        {isHost && <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleScreenShare()}><ScreenShareIcon fillcolor="black"/></Button>}
        <div className="flex items-center space-x-2">
        <Switch checked={switchStatus} onCheckedChange={switchStatusChanged}/>
        </div>

      </div>
    );
  }

export default Controls;
  