import {pool} from 'src/app/api/dbOps/db'
import { NextResponse } from "next/server";
import { decodeJWT } from 'aws-amplify/auth';
import { headers } from "next/headers";

export async function POST(request ,{ params }) {
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

        const res = await pool.query('select * from webinar_enrollment where webinar_id =$1 and user_id=$2', [webinar_id, user_id]);

        if(res.rows.length > 0){
            const rows = res.rows
            return NextResponse.json({ rows })
        }      
        else{
            return NextResponse.json({  })
        }  

    }
    catch(error){
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });        
    }

  }