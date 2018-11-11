const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env' });

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Use express middleware to populate current user
// decode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
  // grab our token from the cookie
  const { token } = req.cookies;
  // console.log(token);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
