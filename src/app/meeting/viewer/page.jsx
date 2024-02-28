"use client"
import React from 'react';
import dynamic from "next/dynamic";
import { Amplify } from 'aws-amplify';
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import amplifyconfig from 'src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);


const Page = () => {
    const MeetingAppContainer = dynamic(
      () => import("src/components/meeting/ParticipantMeeting"),
      {
        ssr: false,
      }
    );
  
    return (
      <>
      <Authenticator>{({user}) => (
        <MeetingAppContainer username={user.username}/>
      )}</Authenticator>
        
      </>);

  };

export default React.memo(Page);