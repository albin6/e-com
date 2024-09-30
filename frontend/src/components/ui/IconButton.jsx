export const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
    aria-label={label}
  >
    {icon}
  </button>
);
