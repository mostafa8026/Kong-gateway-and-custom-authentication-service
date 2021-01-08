let id = 1;

const products = [
  {
    name: "Product 1",
    price: "1 $",
    createdBy: "Admin",
    createAt: new Date(),
  },
];

function addProduct(user) {
  id += 1;
  const product = {
    name: `Product ${id}`,
    price: `${id} $`,
    createdBy: `${user.firstname} - ${user.lastname}`,
    createAt: new Date(),
  };
  products.push(product);
  return product
}

module.exports = {
  products,
  addProduct,
};
