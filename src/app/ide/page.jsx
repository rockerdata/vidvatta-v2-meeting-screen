"use client"

import React, {useEffect}  from 'react';
import '@aws-amplify/ui-react/styles.css';
import Room  from 'src/components/collaboration/Room'

import amplifyconfig from 'src/amplifyconfiguration.json';
import { Toaster } from "src/components/ui/toaster"
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { KernelManagerProvider } from 'src/components/ide/kernelContext';

Amplify.configure(amplifyconfig);

const initialEditors = [];

const Page = ({user}) => {

    const roomName = "session1"

    return (
        <>
        <KernelManagerProvider>
        <Toaster />
        {user && <Room username={user.username} roomName={roomName}/>}
        </KernelManagerProvider>
        </>
    );

}

export default withAuthenticator(Page);