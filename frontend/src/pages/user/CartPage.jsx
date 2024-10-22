<<<<<<< HEAD
import React from "react";
=======
import React, { createContext, useState } from "react";
>>>>>>> wishlist-cart-management
import Header from "../../components/user/Header";
import Cart from "../../components/user/cart/Cart";
import Footer from "../../components/user/Footer";

<<<<<<< HEAD
=======
export const stockContext = createContext([]);

function StockContextProvider({ children }) {
  const [stock, setStock] = useState([]);

  function handleStockChange(newStock) {
    setStock(newStock);
  }

  return (
    <stockContext.Provider value={{ stock, handleStockChange }}>
      {children}
    </stockContext.Provider>
  );
}

>>>>>>> wishlist-cart-management
function CartPage() {
  return (
    <>
      <Header />
<<<<<<< HEAD
      <Cart />
=======
      <StockContextProvider>
        <Cart />
      </StockContextProvider>
>>>>>>> wishlist-cart-management
      <Footer />
    </>
  );
}

export default CartPage;
