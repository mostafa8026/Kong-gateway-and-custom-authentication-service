const express = require("express");
const bodyParser = require("body-parser");
const { products, addProduct } = require("./products");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/public", (req, res) => {
  res.status(200).send({
    products,
    count: products.length,
    message: "[Backend Service] This is Public route!",
  });
});

app.post("/private", (req, res) => {
  const { authUser } = req.body;
  if (!authUser) res.statusCode(500);
  const product = addProduct(authUser);
  res.status(200).send({
    product,
    message: "[Backend Service] Product created successfully!",
  });
});

app.listen(port, () => {
  console.log(`[Backend Service] listening at http://localhost:${port}`);
});
