import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function AddCategoryForm({ onAddCategory }) {
  const [title, setTitle] = useState("");
  const [isListed, setIsListed] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCategory({ title, isListed });
    setTitle("");
    setIsListed(true);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Category Title"
          className="flex-grow p-2 border rounded"
          required
        />
        <Switch
          checked={isListed}
          onChange={setIsListed}
          className={`${
            isListed ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable category</span>
          <span
            className={`${
              isListed ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>
    </form>
  );
}

export default AddCategoryForm;
