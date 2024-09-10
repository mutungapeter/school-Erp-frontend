import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
export const AddSubject = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="bg-[#36A000] cursor-pointer text-center justify-center text-white py-2 px-4 flex items-center space-x-3 rounded-md hover:bg-[#36A000]"
      >
        <FaPlus color="white" size={20} />
        <span>Add New</span>
      </div>

      {isOpen && (
        <div className="modal fixed z-50 w-full h-full top-0 left-0 flex items-start justify-center transition-opacity duration-300 ease-out">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50 transition-opacity duration-300 ease-out"
            onClick={handleCloseModal}
          ></div>

          <div
            className={`modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto mt-10 transform transition-all duration-300 ease-out ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Add New Subject</p>
                <div
                  className="modal-close cursor-pointer z-50"
                  onClick={handleCloseModal}
                >
                  <svg
                    className="fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path d="M1.39 1.393l15.318 15.314m-15.318 0L16.706 1.393" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Subject Name Input */}
                <div>
                  <label htmlFor="subjectName" className="block text-gray-700 font-semibold mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    placeholder="Enter subject name"
                    className="w-full py-3 px-4 rounded-md border border-blue-500 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

              
                <div className="relative">
                  <label htmlFor="subjectType" className="block text-gray-700 font-semibold mb-2">
                    Subject Type
                  </label>
                  <select
                    id="subjectType"
                    className="w-full appearance-none py-3 px-4 rounded-md border border-blue-500 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">Select subject type</option>
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                  </select>
               
                  <IoMdArrowDropdown className="absolute top-10 right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="modal-close px-4 bg-white py-2 rounded-md text-black border border-gray-400 "
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button className="px-4 bg-purple-500 py-2 rounded-md text-white hover:bg-purple-400">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
