import React, { useState } from "react";
import { Button } from "../ui/button";

function JoinScreen({ getMeetingAndToken }) {
    const [meetingId, setMeetingId] = useState(null);
    const onClick = async () => {
      await getMeetingAndToken(meetingId);
    };
    return (
      <div>
        
        <input
          type="text"
          placeholder="Enter Meeting Id"
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <Button variant="outline" onClick={onClick}>Join</Button>
        {" or "}
        <Button variant="outline" onClick={onClick}>Create Meeting</Button>
      </div>
    );
  }
  
export default JoinScreen;