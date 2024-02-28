"use client"
import React, { useState, useCallback } from 'react';
import Ide from 'src/app/ide/page'
import MeetingProvider from "src/app/meeting/viewer/page";

const LiveSession = () => {
  const [dividerPosition, setDividerPosition] = useState(50); // Initial position at 50%

  const handleDrag = useCallback((e) => {
    // Prevent default action (e.g., text selection) during drag
    e.preventDefault();
    // Calculate new divider position based on mouse position
    const newDividerPosition = (e.clientX / window.innerWidth) * 100;
    setDividerPosition(newDividerPosition);
  }, []);

  const startResizing = useCallback(() => {
    // Listen for mouse movements when dragging starts
    window.addEventListener('mousemove', handleDrag);
    // Stop resizing when mouse button is released
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', handleDrag);
    }, { once: true });
  }, [handleDrag]);

  return (
    <div className="flex w-full h-screen">
      {/* Component 1 */}
      <div
        className="h-full overflow-auto"
        style={{ width: `${dividerPosition}%` }}
      >
        <MeetingProvider/>
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={startResizing}
        className="cursor-col-resize bg-gray-400 w-2 h-full"
      ></div>

      {/* Component 2 */}
      <div
        className="h-full overflow-auto"
        style={{ width: `${100 - dividerPosition}%` }}
      >
        <Ide/>
      </div>
    </div>
  );
};

export default LiveSession;
