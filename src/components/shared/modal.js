/*
Author: Sara
Description: A reusable modal component that can be used to display content in a dialog box.
To use this component, you can import it and pass the `isOpen` prop to control visibility,
and the `onClose` prop to handle closing the modal. The `children` prop can be used to pass any content you want to display inside the modal.

*/


export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg relative w-1/2">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  