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
    createdBy: `${user.firstName} - ${user.lastName}`,
    createAt: new Date(),
  };
  products.push(product);
}

module.exports = {
  products,
  addProduct,
};
