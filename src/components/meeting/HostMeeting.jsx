import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import { authToken, getTempToken, createMeeting } from "./api";
import MeetingView from './MeetingView'
import JoinScreen from "./JoinScreen";


function App() {
  const [meetingId, setMeetingId] = useState("rxyl-qr0b-lokc");//"yy6i-uima-4vyv");
  const [participantId, setParticipantId] = useState("id-124");

    useEffect(() => {

    }, []);

  const getMeetingAndToken = async (id) => {

    const tokenResponse = await getTempToken({roomId: "test-meeting", participantId: participantId, isHost: true});
    console.log('token Response', tokenResponse);

    const meetingId =
    id == null ? await createMeeting({token: tokenResponse.token}) : id;

    // const meetingId = "yy6i-uima-4vyv";
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Host User",
        participantId: participantId
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView isHost={true} meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;