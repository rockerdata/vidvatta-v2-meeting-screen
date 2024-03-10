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
    const { userid, colab_userid, kernelid, language, msg, taskarn } = req;

    if (!userid || !colab_userid || !kernelid || !language || !msg || !taskarn ) {
        // Using NextResponse to send a 400 status code
        return new NextResponse(JSON.stringify({ message: 'Incomplete information available' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }

    const result = await pool.query(
      'INSERT INTO trans.tbl_code_run_logs(userid, colab_userid, kernelid, language, msg, taskarn) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [userid, colab_userid, kernelid, language,msg, taskarn ]
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
