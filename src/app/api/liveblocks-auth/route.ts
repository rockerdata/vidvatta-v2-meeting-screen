import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const API_KEY = "sk_dev_X385QGwAHQe1UroimFq-fR9Ug28L8O_RUCqOoQ7hspcf4t43JQuQ_Ho4auUKkjm2";

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

export async function POST(request: NextRequest) {

  // const user = {
  //   id: "charlielayne@example.com",
  //   info: {
  //     name: "Charlie Layne",
  //     color: "#D583F0",
  //     picture: "https://liveblocks.io/avatars/avatar-1.png",
  //   },
  // };

    // Give the user access to the room
  const { username,  room } = await request.json();

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(username
  //   , {
  //   userInfo: user.info,
  // }
  );

  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}