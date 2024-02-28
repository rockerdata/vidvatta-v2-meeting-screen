import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import LiveblocksProvider from "@liveblocks/yjs";

import amplifyconfig from 'src/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from "aws-amplify/auth";

Amplify.configure(amplifyconfig);


const client = createClient({
  // publicApiKey: "pk_dev_7wUxE38F-uEABZgHZ92qlqNtTZJ7FKVF_tNsWMT_50gFfuAEPG2zlZn17P8jB2qL",
  // throttle: 100,
  authEndpoint: async (room) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const user = await getCurrentUser();
    const body = JSON.stringify({
      // Custom body
      // ...
      username: user.username,
      room: room,
    });

    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers,
      body,
    });

    return await response.json();
  },
});

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  }
} = createRoomContext(client, {
  async resolveUsers({ userIds }) {
    // Used only for Comments. Return a list of user information retrieved
    // from `userIds`. This info is used in comments, mentions etc.
    
    // const usersData = await __fetchUsersFromDB__(userIds);
    // 
    // return usersData.map((userData) => ({
    //   name: userData.name,
    //   avatar: userData.avatar.src,
    // }));
    
    return [];
  },
  async resolveMentionSuggestions({ text, roomId }) {
    // Used only for Comments. Return a list of userIds that match `text`.
    // These userIds are used to create a mention list when typing in the
    // composer. 
    //
    // For example when you type "@jo", `text` will be `"jo"`, and 
    // you should to return an array with John and Joanna's userIds:
    // ["john@example.com", "joanna@example.com"]
    
    // const userIds = await __fetchAllUserIdsFromDB__(roomId);
    //
    // Return all userIds if no `text`
    // if (!text) {
    //   return userIds;
    // }
    //
    // Otherwise, filter userIds for the search `text` and return
    // return userIds.filter((userId) => 
    //   userId.toLowerCase().includes(text.toLowerCase())  
    // );
    
    return [];
  },
});

