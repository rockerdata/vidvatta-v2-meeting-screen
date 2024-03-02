"use client";

import { useEffect } from "react";
import { RoomProvider } from "../../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import Ide from "../ide/ide";



// app/routes/rooms.js
export async function createRoom(username, sessionName) {
  const res = await fetch('https://api.liveblocks.io/v2/rooms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer sk_dev_X385QGwAHQe1UroimFq-fR9Ug28L8O_RUCqOoQ7hspcf4t43JQuQ_Ho4auUKkjm2`
    },
    body: JSON.stringify({
      "id": username + '-' + sessionName,
      "defaultAccesses": [
        "room:write"
      ],
      "metadata": {
        "session": sessionName
      }
    })
    
  });

  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      console.log("room already exists");
  }
   
  return res.json()
}

export default function Room({username, roomName, selectedRoom, toggle}){

    useEffect(() => {
      if(username && roomName){
        console.log("Room.js: ", username);
        createRoom(username, roomName);
      }
      console.log('selectedRoom', selectedRoom);
    }, [])

  return (
    <>
    <RoomProvider
      id={selectedRoom? selectedRoom : username + '-' + roomName}
      initialPresence={{
        cursor: null,
      }}
      >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => <Ide username={username} toggle={toggle}/>}
      </ClientSideSuspense>
    </RoomProvider>
    </>
  );
}
