"use client"
import dynamic from "next/dynamic";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import amplifyconfig from 'src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);


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

export default withAuthenticator(page);