const jwt = require('jsonwebtoken');

const API_KEY = process.env.API_KEY;
const SECRET = process.env.SECRET;

const options = { 
 expiresIn: '120m', 
 algorithm: 'HS256' 
};

function getPermissions(isHost){
    console.log("Host", isHost);
    if(isHost === true){
      return ['allow_join','allow_mod']
    }
    else{
      return ['allow_join']
    }
}

export async function POST(req) {
 
  const data = await req.json();
  const permissions = getPermissions(data.isHost);
  console.log("Permissions", permissions);

  console.log(data);
  const payload = {
    apikey: API_KEY,
    permissions: permissions, // `ask_join` || `allow_mod` 
    roomId: data.roomId, //OPTIONAL
    // participantId: `lxvdplwt`, //OPTIONAL 
    roles: ['crawler', 'rtc'], //OPTIONAL
   };
   
   const token = jwt.sign(payload, SECRET, options);
   console.log(token);

  return Response.json({ 'token': token })
}


