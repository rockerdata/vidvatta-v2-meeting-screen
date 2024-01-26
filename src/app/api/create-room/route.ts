import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const API_KEY = "sk_dev_X385QGwAHQe1UroimFq-fR9Ug28L8O_RUCqOoQ7hspcf4t43JQuQ_Ho4auUKkjm2";

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

export async function POST(request: NextRequest) {
  // Get the current user's info from your database
  const { roomName,  sessionName } = await request.json();

  const room = await liveblocks.createRoom(roomName, {
    // The default room permissions. `[]` for private, `["room:write"]` for public.
    defaultAccesses: ["room:write"],
    // Optional, custom metadata to attach to the room
    metadata: {
      session: sessionName,
    },
  });

  return new Response(JSON.stringify(room), { status: 200 });
}