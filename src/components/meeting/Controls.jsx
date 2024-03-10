import React, {useEffect, useState}  from "react";
import {
  useMeeting, Constants
} from "@videosdk.live/react-sdk";
import { Button } from "src/components/ui/button"
import EndIcon from "src/icons/EndIcon";
import MicOnIcon from "src/icons/MicOnIcon";
import MicOffIcon from "src/icons/MicOffIcon";
import WebcamOnIcon from "src/icons/WebcamOnIcon";
import WebcamOffIcon from "src/icons/WebcamOffIcon";
import ScreenShareIcon from "src/icons/ScreenShareIcon";
import ParticipantsIcon from "src/icons/ParticipantsIcon";
import RecordingIcon from 'src/icons/RecordingIcon'
import PipIcon from "src/icons/PipIcon";
import { Switch } from "src/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select"

function SettingDialog({ isOpen, closeModal }) {
 
  const { getMics, getWebcams, changeMic, changeWebcam } = useMeeting();
  const [mics, setMics] = useState(null);
  const [cameras, setCameras] = useState(null);

  useEffect(() => {
    getMics().then((mic) =>{
      console.log(mic)
      setMics(mic);
    })
  
    getWebcams().then((camera) =>{
      console.log((camera))
      setCameras(camera);
    })
  }, [])



  return (
    <>
    {isOpen && 
      <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">
                    Meeting Settings
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black  float-right text-3xl leading-none font-semibold "
                    onClick={closeModal}
                  >
                    <span className=" text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

            {/*body*/}
            <div className="relative p-6 flex flex-row">
              <div>
              {mics && <Select onValueChange={(value) => changeMic(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Mic" />
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
                {mics.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId}>{mic.label}</SelectItem>  
                ))}
              </SelectGroup>
              </SelectContent>
            </Select>}
            </div>

            <div>
              {cameras && <Select onValueChange={(value) => changeWebcam(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Webcam" />
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
                {cameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>{camera.label}</SelectItem>  
                ))}
              </SelectGroup>
              </SelectContent>
            </Select>}
            </div>

            </div>

          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
    }


    </>
  );
}



function Controls({isHost, toggleCode, toggleParticipants, participantLength}) {

  const [switchStatus, setSwitchStatus] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState(false);
  const [toggleSettingDialog, setToggleSettingDialog] = useState(false);
  const [recordingStatus, setRecordingstatus] = useState("black");


  function onRecordingStateChanged(data) {
    const { status } = data;
  
    if (status === Constants.recordingEvents.RECORDING_STARTING) {
      console.log("Meeting recording is starting");
    } else if (status === Constants.recordingEvents.RECORDING_STARTED) {
      setRecordingstatus("red")
    } else if (status === Constants.recordingEvents.RECORDING_STOPPING) {
      console.log("Meeting recording is stopping");
    } else if (status === Constants.recordingEvents.RECORDING_STOPPED) {
      setRecordingstatus("black")
    } else {
      //
    }
  }


    const { leave, toggleMic, toggleWebcam, toggleScreenShare, localMicOn, localWebcamOn, startRecording, stopRecording } = useMeeting({
      onRecordingStateChanged,
    });
    const {
      /** Methods */
    } = useMeeting({
      onSpeakerChanged: (activeSpeakerId) => {
        console.log("Active Speaker participantId", activeSpeakerId);
      },
    });

    const switchStatusChanged = async (status) => {
      console.log(status);
      setSwitchStatus(status);
      toggleCode(status);
    }

    const toggleSettingDialogFunc = () => {
      setToggleSettingDialog(!toggleSettingDialog);
    }

    const closeModal = () => {
      toggleSettingDialogFunc();
    }

    const handleRecording = () => {
      // Start Recording
      // If you don't have a `webhookUrl` or `awsDirPath`, you should pass null.
      if (recordingStatus === 'black'){
        console.log("Recording started");
        startRecording(null, null, {
          layout: {
            type: "GRID",
            priority: "SPEAKER",
            gridSize: 4,
          },
          theme: "DARK",
          mode: "video-and-audio",
          quality: "high",
          orientation: "landscape",
        });
    }
    else if(recordingStatus === 'red'){
      stopRecording();
    }
    };
  

    return (
      <div className="flex flex-row flex-wrap gap-3 shadow-lg rounded-md p-3">
        <SettingDialog isOpen={toggleSettingDialog} closeModal={closeModal}/>
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => leave()}><EndIcon fillcolor="red"/></Button>
        <Button className="bg-blue-300 hover:bg-blue-400 relative" onClick={() => toggleMic()}>
          {localMicOn ? <MicOnIcon fillcolor="black" /> : <MicOffIcon fillcolor="black" />}

        </Button>
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleWebcam()}>
          {localWebcamOn ? <WebcamOnIcon fillcolor="black"/>: <WebcamOffIcon fillcolor="black"/>}

        </Button>
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleParticipants()}><ParticipantsIcon  fillcolor="black"/>{participantLength}</Button>
        <Button className="bg-blue-300 hover:bg-blue-400" ><PipIcon  fillcolor="black"/></Button>
        {isHost && <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => toggleScreenShare()}><ScreenShareIcon fillcolor="black"/></Button>}
        {isHost && <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => handleRecording()}><RecordingIcon fillcolor={recordingStatus}/></Button>}
        <Button className="bg-blue-300 hover:bg-blue-400" onClick={toggleSettingDialogFunc}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" fill="black" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        </Button>
        <div className="flex items-center space-x-2">
        <Switch checked={switchStatus} onCheckedChange={switchStatusChanged}/>
        {/* Active Speaker - {activeSpeaker} */}
        </div>

      </div>
    );
  }

export default Controls;
  