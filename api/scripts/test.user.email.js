/* still have problem with auth.js */

db.user.remove({});

const userDB = [
  {
    givenName: "still An",
    name: "An",
    email: "nguyen.an.1196@gmail.com",
    password: "string"
  },
  {
    givenName: "Phong",
    name: "Phong",
    email: "@gmail.com",
    password: "String"
  },
  {
    givenName: "Keanu",
    name: "Evgenii",
    email: "?@gmail.com",
    password: "String"
  }
]

db.user.insertMany(userDB);
