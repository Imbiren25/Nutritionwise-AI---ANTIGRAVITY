import React from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <span className="relative group">
      {children}
      <span role="tooltip" className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--neutral-dark-grey)] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {content}
      </span>
    </span>
  )
}

export default Tooltip