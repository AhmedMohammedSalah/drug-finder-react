import InputField from "../components/shared/InputField";
import AddButton from "../components/shared/btn";

function addDrug() {
  return (
    <div className="min-h-screen rounded-[20px] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto justify-center">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl font-bold text-blue-500 mb-4">Add Product</h1>
        </div>
        <div className="relative flex flex-col items-center justify-center ml-auto">
          
          <div className="flex flex-row items-center justify-between mt-4 w-full max-w-md">
              <lable className="text-xl font-bold text-gray-500 mb-4">Procuct Name </lable>
              <input
                type="text"
                placeholder="Procuct Name"
                className="pl-10 pr-4 py-2 border justify-stretch border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-row items-center justify-between mt-4 w-full max-w-md">
              <lable className="text-xl font-bold text-gray-500 mb-4">Product price </lable>
              <input
                type="text"
                placeholder="Product price"
                className="pl-10 pr-4 py-2 border justify-stretch border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-row items-center justify-between mt-4 w-full max-w-md">
              <lable className="text-xl font-bold text-gray-500 mb-4">Product Category </lable>
              <input
                type="text"
                placeholder="Product Category"
                className="pl-10 pr-4 py-2 border justify-stretch border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-row items-center justify-between mt-4 w-full max-w-md">
              <lable className="text-xl font-bold text-gray-500 mb-4">Product Description </lable>
              <input
                type="text"
                placeholder="Product Description"
                className="pl-10 pr-4 py-2 border justify-stretch border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-row items-center justify-between mt-4 w-full max-w-md">
              <lable className="text-xl font-bold text-gray-500 mb-4">Product Image </lable>
              <input
                type="file"
                placeholder="Product Image"
                className="pl-10 pr-4 py-2 border justify-stretch border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center justify-stretch mt-4">
              <AddButton
                btnColor="blue"
                btnShade="500"
                textColor="white"
                hoverShade="600"
                focusShade="400"
                text="Add Product"
                // icon="plus"
                path="/pharmacy/drugs"
              />
            </div>

          </div>
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-4 justify-center">Add Product</h1> */}
      </div>
    </div>
  );
}
export default addDrug;