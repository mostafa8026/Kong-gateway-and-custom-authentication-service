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
  if (!token) res.sendStatus(401);
  const key = token.slice("Bearer ".length);
  if (!token) res.sendStatus(401);
  const user = users.find((user) => user.id == key);

  if (user) {
    res.append('x-user-id', user.id)
    res.append('x-user-firstname', user.firstName)
    res.append('x-user-lastname', user.lastName)
    res.sendStatus(200)
    return
  }

  res.sendStatus(401);
});

app.listen(port, () => {
  console.log(`[Auth Service] listening at http://localhost:${port}`);
});
