import {pool} from 'src/app/api/dbOps/db'
import { NextResponse } from "next/server";

export async function GET(request ,{ params }) {
    const res = await pool.query('select * from blog where blog_id =$1', [params.id]);

    if(res.rows.length > 0){
        const rows = res.rows
        return NextResponse.json({ rows })
    }
    return NextResponse.json({})
  }