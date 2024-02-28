import React, { useEffect, useMemo, useRef } from "react";
import {
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";


const PresenterView = ({ presenterId }) => {

    const { screenShareAudioStream, isLocal, screenShareStream, screenShareOn, displayName } =
    useParticipant(presenterId);
  
    // Creating a reference to the audio element
    const audioPlayer = useRef();
  
    // Playing the screen share audio stream
    useEffect(() => {
        if (
        !isLocal &&
        audioPlayer.current &&
        screenShareOn &&
        screenShareAudioStream
        ) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareAudioStream.track);
  
        audioPlayer.current.srcObject = mediaStream;
        audioPlayer.current.play().catch((err) => {
            if (
            err.message ===
            "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
            ) {
            console.error("audio" + err.message);
            }
        });
        } else {
        audioPlayer.current.srcObject = null;
        }
    }, [screenShareAudioStream, screenShareOn, isLocal]);
  
    //Creating a media stream from the screen share stream
    const mediaStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareStream.track);
        return mediaStream;
        }
    }, [screenShareStream, screenShareOn]);
  
    return (
        <>
          {/* playing the media stream in the ReactPlayer */}
          {/* <div>{displayName}</div> */}
          <ReactPlayer
            //
            playsinline // very very imp prop
            playIcon={<></>}
            //
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={mediaStream} // passing mediastream here
            //
            height={"100%"}
            width={"100%"}
            onError={(err) => {
              console.log(err, "presenter video error");
            }}
          />
  
    {/* Adding this audio tag to play the screen share audio */}
      <audio autoPlay playsInline controls={false} ref={audioPlayer} />
  
        </>
      );
  };
  
export default PresenterView;