import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function EditCategoryModal({ category, onUpdate, onClose }) {
  const [title, setTitle] = useState(category.title);
  const [isListed, setIsListed] = useState(category.isListed);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...category, title, isListed });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span>Status</span>
            <Switch
              checked={isListed}
              onChange={setIsListed}
              className={`${
                isListed ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">
                {isListed ? "Unlist category" : "List category"}
              </span>
              <span
                className={`${
                  isListed ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;