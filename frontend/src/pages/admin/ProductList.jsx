import React from "react";
import ProductListing from "../../components/admin/ProductListing";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";

function ProductList() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <ProductListing />
        </div>
      </div>
    </div>
  );
}

export default ProductList;
