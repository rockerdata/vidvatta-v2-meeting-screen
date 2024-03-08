import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { usePubSub } from "@videosdk.live/react-sdk";

const ChatPopup = ({meetingId, username}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragging, setIsDraggin] = useState(false);
    const [message, setMessage] = useState(""); // State for the input message
    const [messages, setMessages] = useState([]);
    const unreadCount = useRef(0);
  
    // Assuming usePubSub is correctly defined and used elsewhere
    const topic = meetingId;//'CHAT';
  
    useEffect(() => {
        unreadCount.current = 0;
        console.log("Expanding changed", isExpanded, unreadCount.current);
    }, [isExpanded])


    function onMessageReceived(newMessage) {
      console.log('New Message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if(!isExpanded){
        console.log("Count is increasing", isExpanded)
        unreadCount.current = unreadCount.current + 1;
      }
    }
  
    function onOldMessagesReceived(oldMessages) {
      console.log('Old Messages:', oldMessages);
      setMessages(oldMessages);
    }
    
    const {publish} = usePubSub(topic, {
        onMessageReceived,
        onOldMessagesReceived,
    });
  
    const handleSendMessage = () => {
        // Sending the Message using the publish method
        publish(message, { persist: true });
        // Clearing the message input
        setMessage("");
      };
  
    const toggleChat = () => {
      if (!isDragging) {
        setIsExpanded(!isExpanded);
      }
    };
  
    const dragStart = () => {
      setIsDraggin(true);
    };
  
    const dragStop = () => {
      setIsDraggin(false);
    };
  

  return (
    <Draggable handle='.handle' bounds="parent" onStart={dragStart} onStop={dragStop}>
      <div className="fixed bottom-0 right-0 flex flex-col items-end z-50">
      {isExpanded && (
          <div className="bg-white rounded-lg shadow-lg p-4 w-72 h-96 mb-4 flex flex-col">
            <div className="overflow-auto flex-grow">
              {/* Display messages here */}
              {messages.map((msg) => (
                <div key={msg.id} className="bg-gray-200 my-2 p-2 rounded">
                  <strong>{msg.senderName}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex flex-row">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-2 border-gray-300 rounded w-full h-10"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className='flex flex-row'>
            <button
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-400 focus:outline-none"
            onClick={toggleChat}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                
            </button>
            <div className='text-red-600 font-bold text-lg'>{(unreadCount.current > 0 && !isExpanded) && unreadCount.current}</div>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="handle w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg> */}
            </div>
        </div>
    </Draggable>
  );
};

export default ChatPopup;
