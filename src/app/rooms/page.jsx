"use client"

import { useEffect, useState } from "react";
import { withAuthenticator } from '@aws-amplify/ui-react';
import Room  from 'src/components/collaboration/Room'
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from "aws-amplify/auth";

Amplify.configure(amplifyconfig);


// app/routes/rooms.js
export async function getData() {
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
   
    return (
        <div>
            {rooms && rooms.map((room) => (
                <div key={room.id} onClick={() => setSelectedRoom(room.id)}>
                    <h3>{room.id}</h3>
                </div>
            ))}
            {selectedRoom && <Room key={selectedRoom} username={user.username} roomName={selectedRoom}/>}
        </div>
    )
  }
  
export default withAuthenticator(Page);