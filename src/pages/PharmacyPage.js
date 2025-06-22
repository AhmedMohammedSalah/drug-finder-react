import React, { useState, useEffect } from "react";
import Sidebar from "../components/client/sidebarFilter";
import ProductList from "../components/client/ProductList";
import Pagination from "../components/shared/Pagination";
import Toast from "../components/shared/toast";
import apiEndpoints from '../services/api';

{/* [OKS *0-0*]  PharmacyPage*/}
const PharmacyPage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [abovePrice, setAbovePrice] = useState(0);
  const [belowPrice, setBelowPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Example: backend supports ?page= and ?min_price=&max_price=
        const response = await apiEndpoints.inventory.getMedicines({
          params: {
            page,
            min_price: abovePrice,
            max_price: belowPrice,
            // categories: selectedCategories.join(','), // if supported
          },
        });
        setProducts(response.data.results || response.data); // DRF pagination: results key
        setTotalPages(response.data.total_pages || 1); // adjust if your backend returns total_pages
      } catch (err) {
        setErrorMessage(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, abovePrice, belowPrice]);

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
          loading={loading}
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