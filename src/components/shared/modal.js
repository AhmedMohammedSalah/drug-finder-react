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
  