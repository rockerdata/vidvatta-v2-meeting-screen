//Auth token we will use to generate a meeting and connect to it
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI4MGFiMTE3Yi1jNGY1LTQxODEtOGRiOC01MjM0YWJiN2QzYmMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNzU2MzMyMSwiZXhwIjoxNzE1MzM5MzIxfQ.S6qzHAHI_JUFTBMfQ2m6ybJ-bbVLS0-2ne8lp5GK8ug";

export const getTempToken = async ({roomId, participantId, isHost}) => {
  console.log(roomId, participantId)
  const url = `http://localhost:3000/api/meetingToken`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId: roomId,
      participantId: participantId,
      isHost: isHost
    }),
  };

  const response = await fetch(url, options)
  .then((response) => response.json())
  .catch((error) => console.error("error", error));

  return response
};

// API call to create meeting
export const createMeeting = async ({ token }) => {
  try {
        // const tokenResponse = await getTempToken({ roomId: "test-meeting", participantId: "id-123", isHost: isHost });
        console.log(token);

        const url = `https://api.videosdk.live/v2/rooms`;
        const options = {
            method: "POST",
            headers: { Authorization: authToken, "Content-Type": "application/json" },
        };

        const response = await fetch(url, options);
        const data = await response.json();
        return data.roomId;
    } catch (error) {
        console.error("error", error);
        // Handle error appropriately
    }
    
  };