'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownMenuProps {
  triggerLabel: string;
  items: { label: string; onClick: () => void }[];
}

export function DropdownMenu({ triggerLabel, items }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {triggerLabel}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
