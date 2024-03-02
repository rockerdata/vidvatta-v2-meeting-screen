"use client"
import React, {useEffect} from 'react';
import dynamic from "next/dynamic";
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(amplifyconfig);

const Page = () => {
    const MeetingAppContainer = dynamic(
      () => import("../../../components/meeting/ParticipantMeeting"),
      {
        ssr: false,
      }
    );
  
      useEffect(() => {
        console.log("Host Meeting");
      })

    return (
    <>
    <Authenticator>{({user}) => (
      <MeetingAppContainer username={user.username} hostFlag={true}/>
    )}</Authenticator>
      
    </>);
  };

export default React.memo(Page);