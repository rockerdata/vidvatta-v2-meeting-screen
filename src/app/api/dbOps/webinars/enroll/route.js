import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import {pool} from 'src/app/api/dbOps/db'
import { decodeJWT } from 'aws-amplify/auth';
import { headers } from "next/headers";

export async function POST(request, {params}) {
  // Get the current user's info from your database
  // console.log(request.json());
  const req = await request.json();
  console.log(req)

  const headersList = headers();
  try{
    const autherization = headersList.get("authorization");
    console.log(decodeJWT(autherization));
    }
    catch(error){
        return new NextResponse(JSON.stringify({ message: 'Unauthenticated' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
            });
    }

  try {
    const { webinar_id, user_id } = req;

    if (!webinar_id || !user_id) {
        // Using NextResponse to send a 400 status code
        return new NextResponse(JSON.stringify({ message: 'Webinar ID and User ID are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }

    const result = await pool.query(
      'INSERT INTO webinar_enrollment(webinar_id, user_id, inserted_on, updated_on) VALUES($1, $2, NOW(), NOW()) RETURNING *',
      [webinar_id, user_id]
    );

      // Using NextResponse to send a 200 status code and response body
      return new NextResponse(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: error.detail }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
