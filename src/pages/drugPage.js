/*
Author: Sara
Description: Drugs page for the pharmacy dashboard, showcasing a list of items with delete and edit functionality.
*/
import { useState } from 'react';
import { TrashIcon, PencilIcon, HomeIcon } from '@heroicons/react/24/solid';
import IconButton from '../components/shared/btn'; 
import Modal from "../components/shared/modal";
import Sidebar from "../components/shared/sidebar";
import ProductList from '../components/client/ProductList';

 const categories = [
    { _id: "1", name: "Electronics" },
    { _id: "2", name: "Clothing" },
    { _id: "3", name: "Books" },
  ];

  const goToHome = () => {
    console.log("Navigating to Home...");
  };

function Drugs() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(['Item 1', 'Item 2']); // Example data

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setShowModal(true);
  };

  return (


    <div className="min-h-screen rounded-[20px] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product List</h1>
        <p className="text-lg text-gray-600 mb-6">
          This is the product list for pharmacists.
        </p>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          
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
