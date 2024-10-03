import { Switch } from "@headlessui/react";

function CategoryTable({ categories, onDelete, onEdit, onToggleStatus }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2 text-left">ID</th>
          <th className="border p-2 text-left">Title</th>
          <th className="border p-2 text-center">Status</th>
          <th className="border p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id} className="border-b">
            <td className="border p-2">{category.id}</td>
            <td className="border p-2">{category.title}</td>
            <td className="border p-2 text-center">
              <Switch
                checked={category.isListed}
                onChange={() => onToggleStatus(category.id)}
                className={`${
                  category.isListed ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">
                  {category.isListed ? "Unlist category" : "List category"}
                </span>
                <span
                  className={`${
                    category.isListed ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </td>
            <td className="border p-2 text-center">
              <button
                onClick={() => onEdit(category)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CategoryTable;
