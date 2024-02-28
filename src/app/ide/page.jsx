"use client"

import React, {useEffect}  from 'react';
import '@aws-amplify/ui-react/styles.css';
import Room  from 'src/components/collaboration/Room'

import { Toaster } from "src/components/ui/toaster"
import { KernelManagerProvider } from 'src/components/ide/kernelContext';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(amplifyconfig);

const initialEditors = [];


const Page = () => {

    const roomName = "session1"

    return (
        <>
        <Authenticator>{({user}) => (
            <KernelManagerProvider>
            <Toaster />
            {user && <Room username={user.username} roomName={roomName}/>}
            </KernelManagerProvider>
        )}</Authenticator>
        </>
    );

}

export default Page;