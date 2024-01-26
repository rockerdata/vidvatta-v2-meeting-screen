"use client"
import dynamic from "next/dynamic";


const page = () => {
    const MeetingAppContainer = dynamic(
      () => import("../../../components/meeting/HostMeeting"),
      {
        ssr: false,
      }
    );
  
    return (
    <>
      <MeetingAppContainer />
    </>);
  };

export default page;