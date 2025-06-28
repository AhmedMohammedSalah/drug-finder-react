import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import apiEndpoints from "../../services/api";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const MedicineCard = ({ medicine, onDeleted, onEdit }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(`Deleting "${medicine.brand_name}"...`, {
      position: "top-right"
    });
    
    try {
      await apiEndpoints.inventory.deleteMedicine(medicine.id);
      toast.success(`"${medicine.brand_name}" deleted successfully!`, {
        id: toastId,
        position: "top-right"
      });
      onDeleted();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(`Failed to delete "${medicine.brand_name}"`, {
        id: toastId,
        position: "top-right"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteConfirmation = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="relative w-64 bg-white border border-gray-200 rounded-xl pt-10 pb-4 px-4 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(medicine)}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-blue-500 hover:text-blue-600 transition-all duration-200 border border-gray-200 hover:border-blue-200"
            aria-label="Edit medicine"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={openDeleteConfirmation}
            disabled={isDeleting}
            className={`p-2 bg-white rounded-full shadow-sm hover:shadow-md text-red-500 hover:text-red-600 transition-all duration-200 border border-gray-200 hover:border-red-200 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Delete medicine"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>

        {/* Medicine image */}
        <div className="w-full h-40 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={medicine.image || "/placeholder.png"}
            alt={medicine.brand_name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        {/* Medicine details */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {medicine.brand_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {medicine.generic_name}
          </p>

          <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                medicine.stock > 10
                  ? "bg-green-100 text-green-800"
                  : medicine.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {medicine.stock} in stock
            </span>
            <span className="text-base font-semibold text-blue-600">
              ${parseFloat(medicine.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Medicine
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{medicine.brand_name}"?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isDeleting
                          ? "bg-red-300"
                          : "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500"
                      }`}
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MedicineCard;