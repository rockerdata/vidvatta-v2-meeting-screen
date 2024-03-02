"use client"
import React from 'react';
import dynamic from "next/dynamic";
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
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
        <MeetingAppContainer username={user.username} hostFlag={false}/>
      )}</Authenticator>
        
      </>);

  };

export default React.memo(Page);