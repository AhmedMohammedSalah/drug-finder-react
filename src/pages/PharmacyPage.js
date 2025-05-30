
import React, { useState } from "react";
import Sidebar from "../components/client/sidebarFilter";
import ProductList from "../components/client/ProductList";
import Pagination from "../components/shared/Pagination";
import Toast from "../components/shared/toast";

{/* [OKS *0-0*]  PharmacyPage*/}
const PharmacyPage = ({ products, categories, totalPages }) => { 
  const [abovePrice, setAbovePrice] = useState(0);
  const [belowPrice, setBelowPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");



  const toggleViewMode = (mode) => setViewMode(mode);
  const changePage = (newPage) => setPage(newPage);

  return (
    <div className="container mx-auto my-4 px-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Sidebar
          products={products}
          abovePrice={abovePrice}
          belowPrice={belowPrice}
          setAbovePrice={setAbovePrice}
          setBelowPrice={setBelowPrice}
        />
        <ProductList
          products={products || []}
          viewMode={viewMode}
          toggleViewMode={toggleViewMode}
        />
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        changePage={changePage}
      />
      <Toast message={errorMessage} />
    </div>
  );
};

export default PharmacyPage;