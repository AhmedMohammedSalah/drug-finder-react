/*
Author: Sara
Description: Drugs page for the pharmacy dashboard
*/
import { useState } from "react";
import { Search } from "lucide-react";
import IconButton from "../components/shared/btn";
import Modal from "../components/shared/modal";
import PharmProductCard from "../components/shared/PharmProductCard";

const categories = [
  { id: "1", name: "Aspirin", price: 9.99, categoryId: "1" },
  { id: "2", name: "Panadol", price: 9.99, categoryId: "2" },
  { id: "3", name: "Dolibran", price: 9.99, categoryId: "3" },
];

function Drugs() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(categories);

  const handleDeleteProduct = (productId) => {
    setSelectedProduct(products.find((p) => p.id === productId));
    setShowModal(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setShowModal(false);
  };

  return (
    <div className="min-h-screen rounded-[20px] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto justify-center">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product List</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <IconButton
            btnColor="blue"
            btnShade="500"
            textColor="white"
            hoverShade="600"
            focusShade="400"
            path="/pharmacy/drugs/add"
            text="Add Product"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <PharmProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              categoryId={product.categoryId}
              onDelete={() => handleDeleteProduct(product.id)}
            />
          ))}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-4">Delete Product</h2>
          <p>Are you sure you want to delete {selectedProduct?.name}?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Drugs;
