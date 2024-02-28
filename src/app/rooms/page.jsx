"use client"

import { useEffect, useState } from "react";
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import Room  from 'src/components/collaboration/Room'
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from "aws-amplify/auth";
import { KernelManagerProvider } from 'src/components/ide/kernelContext';


Amplify.configure(amplifyconfig);


// app/routes/rooms.js
async function getData() {
    const res = await fetch('https://api.liveblocks.io/v2/rooms', {
      headers: {
        Authorization: `Bearer sk_dev_X385QGwAHQe1UroimFq-fR9Ug28L8O_RUCqOoQ7hspcf4t43JQuQ_Ho4auUKkjm2`
      }
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
     
    return res.json()
}
  
const Page = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getData()
            return data
        }
        fetchData().then((data) => {
            console.log('data:', data);
            setRooms(data.data);
        });
        getCurrentUser().then((user) => {
            console.log('user:', user);
            setUser(user);
        });
    }, []);

    useEffect(() => {
        console.log('selectedRoom:', selectedRoom);
    }, [selectedRoom]);

    const resetSelectedRoom = async () => {
        setSelectedRoom(null);
    }

   
    return (
        <>
        <Authenticator>{({user}) => (
            <aside className="flex">
                <div className="h-screen py-8 overflow-y-auto bg-white border-l border-r w-1/6 dark:bg-gray-900 dark:border-gray-700">
                    <h2 className="px-5 text-lg font-medium text-gray-800 dark:text-white">Accounts</h2>
                    <div className="mt-8 space-y-4">
                        {rooms && rooms.map((room) => (
                            <div key={room.id}  className="flex flex-row">
                            <button 
                                
                                onClick={() => setSelectedRoom(room.id)}
                                className={`flex items-center w-full px-5 py-2 transition-colors duration-200 gap-x-2 focus:outline-none ${selectedRoom === room.id ? 'bg-gray-100 dark:bg-gray-800' : 'dark:hover:bg-gray-800 hover:bg-gray-100'}`}
                            >
                                <div className="relative">
                                    {/* Replace with dynamic image source if available */}
                                    <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100" alt=""/>
                                    {room.isOnline && <span className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>}
                                </div>
                                <div className="text-left rtl:text-right">
                                    <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{room.id}</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{room.followers} Followers</p>
                                </div>
                            </button>
                            
                            {(selectedRoom === room.id) && 
                            <button onClick={resetSelectedRoom}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:bg-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                            }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 h-screen w-5/6">
                <KernelManagerProvider>
                    {selectedRoom && <Room key={selectedRoom} username={user.username} selectedRoom={selectedRoom}/>}
                    </KernelManagerProvider>
                </div>
            </aside>
            )}</Authenticator>
        </>
    )
  }
  
export default withAuthenticator(Page);