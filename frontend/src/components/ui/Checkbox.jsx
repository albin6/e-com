import React from 'react'

export function Checkbox({ onCheckedChange, ...props }) {
  return <input type="checkbox" {...props} onChange={(e) => onCheckedChange(e.target.checked)} />
}