import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import CategoryListing from "../../components/user/CategoryListing";

function CategoryListingPage() {
  return (
    <>
      <Header />
      <CategoryListing />
      <Footer />
    </>
  );
}

export default CategoryListingPage;
