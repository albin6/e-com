import { Link } from "react-router-dom";

export const NavLink = ({ href, children }) => (
  <Link to={href} className="text-gray-600 hover:text-gray-800">
    {children}
  </Link>
);
