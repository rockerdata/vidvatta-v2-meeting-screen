import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import { authToken, getTempToken, createMeeting } from "./api";
import MeetingView from './MeetingView'
import JoinScreen from "./JoinScreen";


function Meeting({username, hostFlag}) {
  const [meetingId, setMeetingId] = useState("yy6i-uima-4vyv");
  const [participantId, setParticipantId] = useState("id-124");

    useEffect(() => {
      console.log("Username", username);
      setParticipantId(username);
    }, []);

  const getMeetingAndToken = async (id) => {

    const tokenResponse = await getTempToken({roomId: "test-meeting", participantId: participantId, isHost: hostFlag});
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
        name: username,
        participantId: username
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView isHost={hostFlag} meetingId={meetingId} username={username} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    // <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    <></>
  );
}

export default Meeting;