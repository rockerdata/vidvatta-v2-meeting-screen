const { Pool } = require('pg');

// Create a new PostgreSQL connection pool
// export const pool = new Pool({
//     user: 'postgres',
//     host: '20.239.177.243',
//     database: 'vidvatta',
//     password: 'vidvatta@123',
//     port: 5432, // PostgreSQL default port
//   });
  
// Create a new PostgreSQL connection pool
export const pool = new Pool({
  user: 'vidvatta',
  host: 'vidvatta-db.cbxfxi33fxi8.ap-south-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'Uhh3MGwAOB5NItgHQEHr',
  port: 5432, // PostgreSQL default port
  ssl: {
    rejectUnauthorized: false
  }

});


  // Uhh3MGwAOB5NItgHQEHr