import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface TodoFilterDropdownProps {
  className?: string;
  options: string[];
  selectedFilter?: string;
  handleFilterChange: (filter: string) => void;
}

export function TodoFilterDropdown({
  className,
  options,
  handleFilterChange,
  selectedFilter,
}: TodoFilterDropdownProps) {
  return (
    <div className={className}>
      <Menu>
        <MenuButton className='inline-flex items-center rounded-full bg-gray-800 px-4 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700'>
          Options
        </MenuButton>

        <MenuItems
          transition
          anchor='bottom end'
          className='w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1.5 text-sm/6 text-black shadow transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'
        >
          {options.map((option) => (
            <MenuItem key={option}>
              <button
                onClick={() => handleFilterChange(option)}
                className={`group flex w-full items-center rounded-lg px-4 py-1.5 data-[focus]:bg-black/5 ${selectedFilter === option ? 'bg-black/5' : ''}`}
              >
                {option}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}
