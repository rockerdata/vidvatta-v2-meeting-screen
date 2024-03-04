import {pool} from 'src/app/api/dbOps/db'
import { NextResponse } from "next/server";

export async function GET() {
    const res = await pool.query('select * from webinar_master');

    if(res.rows.length > 0){
        const rows = res.rows;
        return NextResponse.json({ rows });
    }
    return NextResponse.json({})
  }