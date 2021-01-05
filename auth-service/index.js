const { timeStamp } = require("console");
const express = require("express");
const app = express();
const port = 3000;

const users = [
  {
    id: 123,
    firstName: "Jane",
    lastName: "Doe",
  },
  {
    id: 456,
    firstName: "John",
    lastName: "Doe",
  },
];

app.get("/login", (req, res) => {
  const token = req.headers.authorization;
  const user = users.find((user) => user.id == token);

  if (user) {
    res.status(200),
      send({
        user,
        message: "[Auth Service] Login successfully!",
      });
  }

  res.statusCode(401);
});

app.listen(port, () => {
  console.log(`[Auth Service] listening at http://localhost:${port}`);
});
