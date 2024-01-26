import React, { useState } from "react";
import {
    useMeeting,
    usePubSub
  } from "@videosdk.live/react-sdk";
import PresenterView from "./PresenterView";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";
import Chat from './Chat'
import { Button } from "../ui/button";


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
  

    const { join } = useMeeting();
    const { participants, presenterId  } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        onMeetingLeft: () => {
            props.onMeetingLeave();
        },
        onWebcamRequested: ({ participantId, accept, reject }) => {

            setIsModalOpen(true);
            setRequestParticipantId(participantId);
    
            // Store the accept and reject callbacks
            setAcceptReject({ accept, reject });
            setToggleMessage(`Allow Host to toggle webcam?`)

            console.log("Webcam Toggle Requested", participantId);
        },
        onMicRequested: ({ participantId, accept, reject }) => {
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
      <div className="container">
        <h3 >Meeting Id: {props.meetingId}</h3>
        {joined && joined == "JOINED" ? (
          <div className="flex flex-col">
            <div className="w-full flex justify-center items-center"><Controls  isHost={props.isHost}/></div>
            <ConfirmModal
                toggleMessage={toggleMessage}
                isOpen={isModalOpen}
                onAccept={handleAccept}
                onReject={handleReject}
                participantId={requestParticipantId}
            />

            <div className="mt-3 w-full flex justify-center items-center">
            {presenterId && <PresenterView presenterId={presenterId} />}
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
          <p>Joining the meeting...</p>
        ) : (
          <Button onClick={joinMeeting}>Join</Button>
        )}
      </div>
    );
  }

export default MeetingView;