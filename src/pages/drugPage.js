/*
Author: Sara
Description: Drugs page for the pharmacy dashboard, showcasing a list of items with delete and edit functionality.
*/
import { useState } from 'react';
import { TrashIcon, PencilIcon, HomeIcon } from '@heroicons/react/24/solid';
import { Search, User, Menu, X } from "lucide-react"
import IconButton from '../components/shared/btn'; 
import Modal from "../components/shared/modal";
import Sidebar from "../components/shared/sidebar";
import ProductList from '../components/client/ProductList';
import PharmProductCard from '../components/shared/PharmProductCard';

 const categories = [
    {name: 'Aspirin', price: 9.99, categoryId: '1'},
    {name: 'Panadol', price: 9.99, categoryId: '2'},
    {name: 'Dolibran', price: 9.99, categoryId: '3'},
  ];

  const goToHome = () => {
    console.log("Navigating to Home...");
  };

function Drugs() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(['Item 1', 'Item 2']); // Example data

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setShowModal(false)
  };

  const handleDeleteProduct = (index) => {
    setShowModal(true);
    // Logic to delete the product can be added here
    // For now, we just log the index
    console.log(`Deleting product at index: ${index}`);
    // After confirming deletion, you can remove the product from the list
    // setCategories(categories.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    
  };

  return (


    <div className="min-h-screen rounded-[20px] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto justify-center">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product List</h1>


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
          // icon={HomeIcon}
        />
        </div>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, index) => (
            <>
              <PharmProductCard
                product={item}
                categories={categories}
                onDelete={() => handleDeleteProduct(index)}
                onEdit={() => handleEdit(index)} 
              />
              <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-bold mb-4">Detele Product</h2>
                <p>Are you sure you want to delete this product?</p>
                <IconButton
                  btnColor="red"
                  btnShade="500"
                  textColor="white"
                  hoverShade="600"
                  focusShade="400"
                  onClick={() => handleDelete(index)}
                  text="Delete" />
              </Modal>
            </>

          ))}
        </div>

        
      </div>
    </div>

    // <ProductList categories={categories} goToHome={goToHome} />
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
      
    //   {/* Home Button */}
    //   <IconButton
    //     btnColor="blue"
    //     btnShade="500"
    //     textColor="white"
    //     hoverShade="600"
    //     focusShade="400"
    //     // onClick={() => setShowModal(true)}
    //     path='/'
    //     icon={HomeIcon}
    //     name="Home"
    //   />
    //   <Sidebar categories={categories} goToHome={goToHome} />

    //   {/* List with Delete and Edit Buttons */}
    //   <ul className="mt-4 space-y-2">
    //     {items.map((item, index) => (
    //       <li key={index} className="flex items-center space-x-4">
    //         <span>{item}</span>
    //         <IconButton
    //           btnColor="red"
    //           btnShade="500"
    //           textColor="white"
    //           hoverShade="600"
    //           focusShade="400"
    //           onClick={() => handleDelete(index)}
    //           icon={TrashIcon}
    //           name="Delete"
    //         />
    //         <IconButton
    //           btnColor="green"
    //           btnShade="500"
    //           textColor="white"
    //           hoverShade="600"
    //           focusShade="400"
    //           onClick={() => handleEdit(index)}
    //           icon={PencilIcon}
    //           name="Edit"
    //         />
    //       </li>
    //     ))}
    //   </ul>

    //   <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    //      <h2 className="text-xl font-bold mb-4">Modal Title</h2>
    //      <p>This is a modal with Tailwind and React!</p>
    //    </Modal>
    // </div>
  );
}

export default Drugs;
