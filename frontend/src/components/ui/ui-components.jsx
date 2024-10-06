import React from "react";
import { Link } from "react-router-dom";

export const Textarea = (props) => (
  <textarea
    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
    {...props}
  />
);

export const Select = ({ children, ...props }) => (
  <select
    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
    {...props}
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children }) => <div>{children}</div>;
export const SelectValue = ({ children }) => <span>{children}</span>;
export const SelectContent = ({ children }) => <div>{children}</div>;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export function Button({ children, ...props }) {
  return (
    <button {...props} className={`px-4 py-2 rounded ${props.className || ""}`}>
      {children}
    </button>
  );
}

export function Checkbox({ onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      {...props}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  );
}

export const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
    aria-label={label}
  >
    {icon}
  </button>
);

export function Input(props) {
  return (
    <input
      {...props}
      className={`border rounded px-3 py-2 w-full ${props.className || ""}`}
    />
  );
}

export function Label({ children, ...props }) {
  return <label {...props}>{children}</label>;
}

export const Logo = () => (
  <div className="text-2xl font-bold text-gray-800">SmartShop</div>
);

export const NavLink = ({ href, children }) => (
  <Link to={href} className="text-gray-600 hover:text-gray-800">
    {children}
  </Link>
);
