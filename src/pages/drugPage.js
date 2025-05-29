import { useState } from "react";
import Modal from "../components/shared/modal";

function Drugs() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p>This is a modal with Tailwind and React!</p>
      </Modal>
    </div>
  );
}

export default Drugs;
