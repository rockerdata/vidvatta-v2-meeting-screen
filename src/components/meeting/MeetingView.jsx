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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog"


function ConfirmModal({ toggleMessage, onAccept, onReject, isOpen, participantId }) {
 
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
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                  Host is requesting permission to change
                </p>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onAccept}
                >
                  Allow
                </button>
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onReject}
                >
                  Reject
                </button>

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

function MeetingView(props) {
    const [joined, setJoined] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestParticipantId, setRequestParticipantId] = useState(null);
    const [acceptReject, setAcceptReject] = useState({});
    const [toggleMessage, setToggleMessage] = useState("");
    const [toggleToCode, setToggleToCode] = useState(false);
    const [hideParticipants, setHideParticipants] = useState(false);
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
  
    const toggleParticipants = () => {
      setHideParticipants(!hideParticipants);
    }

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
            
            <div className="w-full flex justify-center items-center"><Controls participantLength={[...participants.keys()].length} toggleParticipants={toggleParticipants} toggleCode={setToggleToCode} isHost={props.isHost}/></div>
            {presenterId && <div>Presentor : {presenterId}</div>}
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
            {hideParticipants && [...participants.keys()].map((participantId) => (
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