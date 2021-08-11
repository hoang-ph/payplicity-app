const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const cors = require('cors');
const { getDb } = require('./new_db.js');

let { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'tempjwtsecretfordevonly';
    console.log('Missing env var JWT_SECRET. Using unsafe dev secret');
  } else {
    console.log('Missing env var JWT_SECRET. Authentication disabled');
  }
}

const routes = new Router();
routes.use(bodyParser.json());

const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
routes.use(cors({ origin, credentials: true }));

function getUser(req) {
  const token = req.cookies.jwt;
  if (!token) return { signedIn: false };

  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    return credentials;
  } catch (error) {
    return { signedIn: false };
  }
}

function createCookie(payload, res) {
  const { givenName, name, email } = payload;
  const credentials = {
    signedIn: true, givenName, name, email,
  };

  const token = jwt.sign(credentials, JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true, domain: process.env.COOKIE_DOMAIN });

  res.json(credentials);
}

routes.post('/signin', async (req, res) => {
  if (!JWT_SECRET) {
    res.status(500).send('Missing JWT_SECRET. Refusing to authenticate');
  }

  let payload;
  const googleToken = req.body.google_token;
  if (googleToken) {
    const client = new OAuth2Client();
    try {
      const ticket = await client.verifyIdToken({ idToken: googleToken });
      payload = ticket.getPayload();
    } catch (error) {
      res.status(403).send('Invalid credentials');
    }
  } else if (req.body.email && req.body.password) {
    const db = getDb();
    payload = await db.collection('user').findOne({
      email: req.body.email,
      password: req.body.password
    })

    if (!payload) {
      res.status(403).send('Invalid credentials');
    }

  } else {
    res.status(400).send({ code: 400, message: 'Missing Token and Credentials' });
    return;
  }


  createCookie(payload, res)
});

routes.post('/signout', async (req, res) => {
  // TODO: maybe broken maybe fix
  if (req.cookie) {
    let email;
    jwt.verify(req.cookie.jwt, JWT_SECRET, function (err, decoded) {
      email = decoded.email
    });
    const user = await db.collection('user').findOne({ email });
    await db.collection('user').updateOne({ "email": user.email }, { $set: { signedIn: false } })
  }

  res.clearCookie('jwt', {
    domain: process.env.COOKIE_DOMAIN,
  });
  res.json({ status: 'ok' });
});

routes.post('/user', (req, res) => {
  res.json(getUser(req));
});

routes.post('/signup', async (req, res) => {
  /*
    Expects user info to be passed in this format
    user : {
      givenName: "String",
      name: "string",
      email: "string",
      password: "string",
    }
  */
  const db = getDb();
  const newUser = req.body.user;
  
  newUser.signedIn = true

  console.log(newUser)
  const result = await db.collection('user').insertOne(newUser);
  const savedUser = await db.collection('user')
    .findOne({ email: result.email })
  console.log("SavedUser", savedUser)

  // TODO: This might be wrong. Maybe savedUser is not the type that we expect
  createCookie(savedUser, res)
})

function mustBeSignedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.signedIn) {
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, { user });
  };
}

function resolveUser(_, args, { user }) {
  return user;
}

module.exports = {
  routes, getUser, mustBeSignedIn, resolveUser,
};
