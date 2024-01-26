import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useParticipant,
  useMeeting,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import MicOffIcon from "src/icons/MicOffIcon";
import MicOnIcon from "src/icons/MicOnIcon";
import WebcamOffIcon from "src/icons/WebcamOffIcon";
import WebcamOnIcon from "src/icons/WebcamOnIcon";
import ParticipantsIcon from "src/icons/ParticipantsIcon";
import SpeakerIcon from "src/icons/SpeakerIcon";
import { Button } from "../ui/button";

function ParticipantView(props) {
    const micRef = useRef(null);

    //Callback for when the participant starts a stream
    function onStreamEnabled(stream) {
      if(stream.kind === 'share'){
        console.log("Share Stream On: onStreamEnabled", stream);
      }
    }
  
    //Callback for when the participant stops a stream
    function onStreamDisabled(stream) {
      if(stream.kind === 'share'){
        console.log("Share Stream Off: onStreamDisabled", stream);
      }
    }

    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, enableMic, enableWebcam, disableMic, disableWebcam } =
      useParticipant(props.participantId, {
        onStreamEnabled,
        onStreamDisabled,
      });

      const handleWebcam = () => {
        // This will emit an event called "onWebcamRequested" to that particular participant
        console.log("WebCam Status", webcamOn)
        if(props.isHost === true ){
            if(webcamOn === true){
                disableWebcam();
            }
            else{
                enableWebcam();
            }
        }
      };
    
      const handleMic = () => {
        // This will emit an event called "onMicRequested" to that particular participant
        console.log("Mic Status", micOn)
        if(props.isHost === true){
            if(micOn === true){
                disableMic();
            }
            else{
                enableMic();
            }
        }
      };

    const videoStream = useMemo(() => {
      if (webcamOn && webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        return mediaStream;
      }
    }, [webcamStream, webcamOn]);
  
    useEffect(() => {
      if (micRef.current) {
        if (micOn && micStream) {
          const mediaStream = new MediaStream();
          mediaStream.addTrack(micStream.track);
  
          micRef.current.srcObject = mediaStream;
          micRef.current
            .play()
            .catch((error) =>
              console.error("videoElem.current.play() failed", error)
            );
        } else {
          micRef.current.srcObject = null;
        }
      }
    }, [micStream, micOn]);
  
    return (
      <div key={props.participantId} className="flex flex-col gap-0  ">


        <audio ref={micRef} autoPlay muted={isLocal} />
        <div className="w-[160px] flex bg-blue-400 items-center justify-center">
          {displayName}
        </div>        
        {webcamOn && (
          <ReactPlayer
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={videoStream}
            height={"90px"}
            width={"160px"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        )}
        <div className="w-[160px] p-2 rounded-sm flex flex-row gap-2 bg-blue-400 items-center justify-center">
          <div className="cursor-pointer" onClick={handleWebcam}> {webcamOn ? <WebcamOnIcon fillcolor="black"/> : <WebcamOffIcon fillcolor="black"/>}</div>
          <div className="cursor-pointer" onClick={handleMic}>  {micOn ? <MicOnIcon fillcolor="black"/> : <MicOffIcon fillcolor="black"/>}</div> 
          <ParticipantsIcon fillcolor="black"/>
        </div>
      </div>
    );
  }
  
export default ParticipantView;