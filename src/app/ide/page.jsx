"use client"

import React, {useEffect}  from 'react';
import Room  from 'src/components/collaboration/Room'

import { Toaster } from "src/components/ui/toaster"
import { KernelManagerProvider } from 'src/components/ide/kernelContext';

import {  Authenticator } from '@aws-amplify/ui-react';


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