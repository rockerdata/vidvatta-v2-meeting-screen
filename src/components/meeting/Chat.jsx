// importing usePubSub hook from react-sdk
import { usePubSub } from "@videosdk.live/react-sdk";
import React, { useState } from "react";

function ChatView() {
    // destructure publish method from usePubSub hook
    var topic = 'CHAT';

    function onMessageReceived(message) {
    console.log('New Message:', message);
    }
    
    function onOldMessagesReceived(messages) {
    console.log('Old Messages:', messages);
    }
    
    const {publish, messages} = usePubSub(topic, {
    onMessageReceived,
    onOldMessagesReceived,
    });
    // State to store the user typed message
    const [message, setMessage] = useState("");
  
    const handleSendMessage = () => {
      // Sending the Message using the publish method
      publish(message, { persist: true });
      // Clearing the message input
      setMessage("");
    };
  
    return (
        <>
          <div>
          <p>Messages: </p>
          {/* {messages} */}
          {messages.map((message) => {
            return (
              <p key={message.id}>
                {message.senderName} says {message.message}
              </p>
            );
          })}
          </div>
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button onClick={handleSendMessage}>Send Message</button>
        </>
      );
    }

export default ChatView;