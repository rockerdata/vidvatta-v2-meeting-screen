"use client"

import React, {useEffect}  from 'react';
import '@aws-amplify/ui-react/styles.css';
import Room  from 'src/components/collaboration/Room'

import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
Amplify.configure(amplifyconfig);

const initialEditors = [];

const Page = ({user}) => {

    const roomName = "session1"

    return (
        <>{user && <Room username={user.username} roomName={roomName}/>}</>
    );

}

export default withAuthenticator(Page);