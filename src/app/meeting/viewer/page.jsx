"use client"
import React from 'react';
import dynamic from "next/dynamic";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import amplifyconfig from 'src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);


const page = ({user}) => {
    const MeetingAppContainer = dynamic(
      () => import("src/components/meeting/ParticipantMeeting"),
      {
        ssr: false,
      }
    );
  
    return <MeetingAppContainer username={user.username}/>;
  };

export default React.memo(withAuthenticator(page));