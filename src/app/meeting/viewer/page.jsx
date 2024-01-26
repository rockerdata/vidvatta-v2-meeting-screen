"use client"
import dynamic from "next/dynamic";


const page = () => {
    const MeetingAppContainer = dynamic(
      () => import("src/components/meeting/ParticipantMeeting"),
      {
        ssr: false,
      }
    );
  
    return <MeetingAppContainer />;
  };

export default page;