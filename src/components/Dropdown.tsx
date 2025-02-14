import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface DropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-1"
      >
        {value ? (
          <>
            <span>{selectedOption?.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:bg-gray-200 rounded-full"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </>
        ) : (
          <>
            {label}
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border py-1 z-[100]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                value === option.value ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}