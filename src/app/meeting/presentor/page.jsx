"use client"
import React from 'react';
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

export default React.memo(withAuthenticator(page));