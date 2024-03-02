'use client'
import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
Amplify.configure(amplifyconfig);

const Dashboard = ({user}) => {
  return (
    <Authenticator>{({user}) => (
    <div>Dashboard</div>
    )}</Authenticator>
  )
}

export default Dashboard