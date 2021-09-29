import React, { useEffect, useState } from "react";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  //products to be rendered on the UI
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    // console.log("Api Called");
    fetch("./products.JSON")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setDisplayProducts(data);
        // console.log("Products Recived");
      });
  }, []);

  useEffect(() => {
    // console.log("Local storage Called");
    if (products.length) {
      const savedCart = getStoredCart();
      const storedCart = [];
      for (const key in savedCart) {
        /* 
    Product er key check kora
 console.log(key) 
 console.log(products)  Product gulah ache kina oita dekha.. 
 */

        const addedProduct = products.find((product) => product.key === key);
        if (addedProduct) {
          const quantity = savedCart[key]; //savedCart[key] quantity return korbe amake
          addedProduct.quantity = quantity;
          storedCart.push(addedProduct);
        }
        console.log(key, addedProduct);
      }
      setCart(storedCart);
    }
  }, [products]); // Dependency deway bar bar call hocche else only ekbar call hoto
  const handleAddToCart = (product) => {
    // console.log(product);
    const newCart = [...cart, product];
    setCart(newCart);
    addToDb(product.key);
  };

  const handleSearch = (event) => {
    // console.log(event.target.value);
    const searchText = event.target.value;
    const matchedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setDisplayProducts(matchedProducts);
    console.log(matchedProducts.length);
  };
  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search Product"
        />
      </div>

      <div className="shop-container">
        <div className="product-container">
          {displayProducts.map((product) => (
            <Product
              key={product.key}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className="cart-container">
          <Cart cart={cart}></Cart>
        </div>
      </div>
    </div>
  );
};

export default Shop;
