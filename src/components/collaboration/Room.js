"use client";

import { useEffect } from "react";
import { RoomProvider } from "../../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import Ide from "../ide/ide";
import { create } from "domain";

// app/routes/rooms.js
export async function createRoom(roomName, sessionName) {
  const res = await fetch('https://api.liveblocks.io/v2/rooms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer sk_dev_X385QGwAHQe1UroimFq-fR9Ug28L8O_RUCqOoQ7hspcf4t43JQuQ_Ho4auUKkjm2`
    },
    body: JSON.stringify({
      "id": roomName,
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

export default function Room({username, roomName}){

    useEffect(() => {
        console.log("Room.js: ", username);
        createRoom(username, "session1");
    }, [])

  return (
    <>
    <RoomProvider
      id={roomName}
      initialPresence={{
        cursor: null,
      }}
      >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => <Ide username={username}/>}
      </ClientSideSuspense>
    </RoomProvider>
    </>
  );
}
