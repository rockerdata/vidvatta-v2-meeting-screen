import React, { useEffect, useState } from "react";
import {
    useMeeting,
    usePubSub
  } from "@videosdk.live/react-sdk";
import PresenterView from "./PresenterView";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";
import Chat from './Chat'
import { Button } from "../ui/button";
import { KernelManagerProvider } from 'src/components/ide/kernelContext';
import Room  from 'src/components/collaboration/Room'

function ConfirmModal({ toggleMessage, onAccept, onReject, isOpen, participantId }) {
 
    return (
      <>
      {isOpen && <div className="modal">
        <div className="modal-content">
          <p>{toggleMessage}</p>
          <button onClick={onAccept}>Accept</button>
          <button onClick={onReject}>Reject</button>
        </div>
      </div>}
      </>
    );
  }

function MeetingView(props) {
    const [joined, setJoined] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestParticipantId, setRequestParticipantId] = useState(null);
    const [acceptReject, setAcceptReject] = useState({});
    const [toggleMessage, setToggleMessage] = useState("");
    const [toggleToCode, setToggleToCode] = useState(false);
    const toggle_session = 'rushi245-session1'
  

    const { join, leave } = useMeeting();

    useEffect(() =>{
      return leave();
    }, [])

    useEffect(() => {
        console.log("toggleToCode", toggleToCode);
    }, [toggleToCode])

    const { participants, presenterId  } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        onMeetingLeft: () => {
            // props.onMeetingLeave();
            setJoined(null);
        },
        onWebcamRequested: ({ participantId, accept, reject }) => {
            console.log("On Webcam Requested called");
            setIsModalOpen(true);
            setRequestParticipantId(participantId);
    
            // Store the accept and reject callbacks
            setAcceptReject({ accept, reject });
            setToggleMessage(`Allow Host to toggle webcam?`)

            console.log("Webcam Toggle Requested", participantId);
        },
        onMicRequested: ({ participantId, accept, reject }) => {
          console.log("On Mic Requested called");
            setIsModalOpen(true);
            setRequestParticipantId(participantId);
    
            // Store the accept and reject callbacks
            setAcceptReject({ accept, reject });
            setToggleMessage(`Allow Host to toggle mic?`)
            console.log("Mic Toggle Requested", participantId)
        },

    });

    const joinMeeting = () => {
      setJoined("JOINING");
      join();
    };
  
    const handleAccept = () => {
        acceptReject.accept();
        setIsModalOpen(false);
        setAcceptReject({ });
      };
    
      const handleReject = () => {
        acceptReject.reject();
        setIsModalOpen(false);
        setAcceptReject({ });
      };

    return (
      <div>
        {/* <h3 >Meeting Id: {props.meetingId}</h3> */}
        <ConfirmModal
                toggleMessage={toggleMessage}
                isOpen={isModalOpen}
                onAccept={handleAccept}
                onReject={handleReject}
                participantId={requestParticipantId}
            />

        {joined && joined == "JOINED" ? (
          <div className="flex flex-col">
            <div className="w-full flex justify-center items-center"><Controls toggleCode={setToggleToCode} isHost={props.isHost}/></div>


            <div className="mt-3 w-full flex justify-center items-center">
            
            
            {//this is coming from controls panel, we will use this to show code panel.
            !toggleToCode?
            (presenterId ? 
            <PresenterView presenterId={presenterId}/> :
            <div className=" bg-gray-100 text-black w-full h-[400px] mt-1 mr-5 ml-5 mb-2 flex flex-row items-center justify-center">
              <div  className="align-middle font-bold text-2xl text-black">No Screenshare Available Yet</div>
            </div>
            ):
            (<div className="w-full">                
              <KernelManagerProvider>
              <Room key={toggle_session} username={props.username} selectedRoom={toggle_session} toggle={true}/>
              </KernelManagerProvider></div>)
            }

            </div>
            <div className="mt-3 w-full flex flex-rows gap-2 overflow-auto overflow-x-scroll">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                isHost={props.isHost}
                participantId={participantId}
                key={participantId}
              />
            ))}
            </div>
            {/* <Chat/> */}
          </div>
        ) : joined && joined == "JOINING" ? (
          <p className="flex justify-center items-center h-full">Joining the meeting...</p>
        ) : (
          <div className="flex justify-center items-center h-full">
          <Button  className="bg-blue-400 text-white font-bold mt-48 py-2 px-4 rounded-md shadow-md" onClick={joinMeeting}>Start the Meeting</Button>
          </div>
        )}
      </div>
    );
  }

export default MeetingView;