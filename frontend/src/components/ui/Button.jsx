import React from 'react'

export function Button({ children, ...props }) {
  return (
    <button {...props} className={`px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 ${props.className || ''}`}>
      {children}
    </button>
  )
}