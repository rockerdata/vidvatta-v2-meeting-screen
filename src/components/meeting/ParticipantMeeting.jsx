import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import { authToken, getTempToken, createMeeting } from "./api";
import MeetingView from './MeetingView'
import JoinScreen from "./JoinScreen";
import { Button } from "../ui/button";


function Meeting({username}) {
  const [meetingId, setMeetingId] = useState("yy6i-uima-4vyv");
  const [participantId, setParticipantId] = useState("id-123");


    useEffect(() => {
      setParticipantId(username);
    }, []);

  const getMeetingAndToken = async (id) => {

    // const tokenResponse = await getTempToken({roomId: "test-meeting", participantId: participantId, isHost: false});
    // console.log('token Response', tokenResponse);

    // const meetingId =
    //   id == null ? await createMeeting({token: tokenResponse.token}) : id;
    const meetingId =
    id == null ? await createMeeting() : id;


    // const meetingId = "yy6i-uima-4vyv";
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return meetingId ? (
    <>
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: username, //"C.V. Raman",
        participantId: participantId
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} username={username} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
    </>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default Meeting;