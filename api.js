const BASE_URL = "https://6300a18859a8760a757d441c.mockapi.io";

const productsTable = document.querySelector("#products tbody");

// READ
export const readProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    const { products } = data;
    console.log(products);
  } catch (error) {
    console.log(error.message);
  }
};
