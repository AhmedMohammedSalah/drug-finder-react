/*
Author: Sara
Description: Drugs page for the pharmacy dashboard, showcasing a list of items with delete and edit functionality.
*/
import { useState } from 'react';
import { TrashIcon, PencilIcon, HomeIcon } from '@heroicons/react/24/solid';
import IconButton from '../components/shared/btn'; 
import Modal from "../components/shared/modal";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
      
      {/* Home Button */}
      <IconButton
        btnColor="blue"
        btnShade="500"
        textColor="white"
        hoverShade="600"
        focusShade="400"
        // onClick={() => setShowModal(true)}
        path='/'
        icon={HomeIcon}
        name="Home"
      />

      {/* List with Delete and Edit Buttons */}
      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-4">
            <span>{item}</span>
            <IconButton
              btnColor="red"
              btnShade="500"
              textColor="white"
              hoverShade="600"
              focusShade="400"
              onClick={() => handleDelete(index)}
              icon={TrashIcon}
              name="Delete"
            />
            <IconButton
              btnColor="green"
              btnShade="500"
              textColor="white"
              hoverShade="600"
              focusShade="400"
              onClick={() => handleEdit(index)}
              icon={PencilIcon}
              name="Edit"
            />
          </li>
        ))}
      </ul>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
         <h2 className="text-xl font-bold mb-4">Modal Title</h2>
         <p>This is a modal with Tailwind and React!</p>
       </Modal>
    </div>
  );
}

export default Drugs;


// import { useState } from "react";
// import Modal from "../components/shared/modal";
// import IconButton from '../components/shared/btn';
// import { HomeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';


// function Drugs() {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <div className="p-4">
//       {/* <button
//         onClick={() => setShowModal(true)}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Open Modal
//       </button> */}

//       <IconButton
//         btnColor="blue"
//         btnShade="500"
//         textColor="white"
//         hoverShade="600"
//         focusShade="400"
//         onClick={() => setShowModal(true)}
//         // icon={HomeIcon} // Pass the icon component
//         name="Home" // Fallback text if no icon
//       />

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <h2 className="text-xl font-bold mb-4">Modal Title</h2>
//         <p>This is a modal with Tailwind and React!</p>
//       </Modal>
//     </div>
//   );
// }

// export default Drugs;
